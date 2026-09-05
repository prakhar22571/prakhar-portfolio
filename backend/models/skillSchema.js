import mongoose from "mongoose";
import { requiredText, assetFields } from "./fields.js";
const skillSchema = new mongoose.Schema({
  title: requiredText("Title"),
  proficiency: { type: Number, required: true, min: 0, max: 100 },
  svg: assetFields,
});
export const Skill = mongoose.model("Skill", skillSchema);
