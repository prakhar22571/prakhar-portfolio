import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { saveWithAssets, removeAsset } from "../utils/assets.js";
import { pickFields } from "../utils/profile.js";

export function imageResource({
  Model,
  fields,
  folder,
  singular,
  plural,
  label,
}) {
  return {
    add: catchAsyncErrors(async (req, res) => {
      const record = await saveWithAssets({
        uploads: [{ key: "svg", file: req.files?.svg, folder }],
        save: (assets) =>
          Model.create({ ...pickFields(req.body, fields), ...assets }),
      });
      res.status(201).json({
        success: true,
        message: `${label} added.`,
        [singular]: record,
      });
    }),
    remove: catchAsyncErrors(async (req, res) => {
      const record = await Model.findByIdAndDelete(req.params.id);
      if (!record) throw new ErrorHandler(`${label} not found.`, 404);
      try {
        await removeAsset(record.svg);
      } catch (error) {
        console.error(
          "Asset cleanup failed:",
          record.svg?.public_id,
          error.message,
        );
      }
      res.json({ success: true, message: `${label} deleted.` });
    }),
    list: catchAsyncErrors(async (req, res) =>
      res.json({ success: true, [plural]: await Model.find() }),
    ),
  };
}
