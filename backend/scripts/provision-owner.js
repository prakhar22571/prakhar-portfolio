import "../app.js";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import mongoose from "mongoose";
import { dbConnection } from "../database/connection.js";
import { User } from "../models/userSchema.js";
import { saveWithAssets } from "../utils/assets.js";
import { pickFields, profileFields } from "../utils/profile.js";
try {
  const source = process.argv[2];
  if (!source)
    throw new Error(
      "Usage: npm run provision-owner -- /path/to/private-owner.json",
    );
  const input = JSON.parse(await readFile(source, "utf8"));
  await dbConnection();
  if (await User.exists({}))
    throw new Error(
      "An account already exists. Select the existing owner with PORTFOLIO_OWNER_ID instead.",
    );
  const types = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".pdf": "application/pdf",
  };
  const uploads = [];
  for (const [key, folder, kind] of [
    ["avatar", "PORTFOLIO AVATAR", "image"],
    ["resume", "PORTFOLIO RESUME", "pdf"],
  ]) {
    if (!input[key + "Path"]) throw new Error(`Provide ${key}Path.`);
    const filePath = path.resolve(path.dirname(source), input[key + "Path"]);
    uploads.push({
      key,
      folder,
      kind,
      file: {
        tempFilePath: filePath,
        size: (await stat(filePath)).size,
        mimetype: types[path.extname(filePath).toLowerCase()],
      },
    });
  }
  const user = await saveWithAssets({
    uploads,
    save: (assets) =>
      User.create({
        ...pickFields(input, [...profileFields, "password"]),
        ...assets,
      }),
  });
  console.log(`Owner created. PORTFOLIO_OWNER_ID=${user.id}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
