import { v2 as cloudinary } from "cloudinary";
import { readFile } from "node:fs/promises";
import ErrorHandler from "../middlewares/error.js";

export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;
const imageTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/svg+xml",
]);

export async function validateUpload(file, label, kind = "image") {
  if (!file || Array.isArray(file) || !file.tempFilePath)
    throw new ErrorHandler(`${label} is required.`);
  if (file.truncated || file.size > MAX_UPLOAD_SIZE)
    throw new ErrorHandler("Files must be 10 MB or smaller.", 413);
  if (
    kind === "pdf"
      ? file.mimetype !== "application/pdf"
      : !imageTypes.has(file.mimetype)
  ) {
    throw new ErrorHandler(
      kind === "pdf"
        ? "Choose a PDF resume."
        : "Choose a PNG, JPG, GIF, WebP, or SVG image.",
    );
  }
  const data = await readFile(file.tempFilePath);
  const text = data.toString("utf8");
  const signatures = {
    "image/png": data
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/jpeg": data[0] === 255 && data[1] === 216 && data[2] === 255,
    "image/gif": /^GIF8[79]a/.test(text),
    "image/webp":
      text.startsWith("RIFF") && data.subarray(8, 12).toString() === "WEBP",
    "image/svg+xml":
      /^(?:<\?xml[^>]*>\s*)?<svg[\s>]/i.test(text.trim()) &&
      !/<script[\s>]|\bon\w+\s*=|javascript:/i.test(text),
    "application/pdf": text.startsWith("%PDF-"),
  };
  if (!signatures[file.mimetype])
    throw new ErrorHandler("The file content does not match its type.");
}

export async function removeAsset(asset, uploader = cloudinary.uploader) {
  if (!asset?.public_id) return;
  await uploader.destroy(asset.public_id, {
    resource_type: asset.resource_type || "image",
  });
}

async function cleanup(assets, uploader) {
  await Promise.all(
    assets.map(async (asset) => {
      try {
        await removeAsset(asset, uploader);
      } catch (error) {
        console.error("Asset cleanup failed:", asset.public_id, error.message);
      }
    }),
  );
}

// New assets are rolled back if upload/persistence fails. Old assets are only
// removed after the new references are committed, so cleanup cannot lose data.
export async function saveWithAssets(
  { uploads, previous = {}, save },
  uploader = cloudinary.uploader,
) {
  for (const upload of uploads)
    await validateUpload(upload.file, upload.key, upload.kind);
  const replacements = {};
  let result;
  try {
    for (const { key, file, folder } of uploads) {
      const uploaded = await uploader.upload(file.tempFilePath, {
        folder,
        resource_type: "image",
      });
      if (!uploaded?.public_id || !uploaded?.secure_url || uploaded.error)
        throw new ErrorHandler("File upload failed.", 502);
      replacements[key] = {
        public_id: uploaded.public_id,
        url: uploaded.secure_url,
      };
    }
    result = await save(replacements);
  } catch (error) {
    await cleanup(Object.values(replacements), uploader);
    throw error;
  }
  await cleanup(
    Object.keys(replacements)
      .map((key) => previous[key])
      .filter(Boolean),
    uploader,
  );
  return result;
}
