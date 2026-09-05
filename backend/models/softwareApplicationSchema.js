import mongoose from "mongoose";
import { requiredText, assetFields } from "./fields.js";
export const SoftwareApplication = mongoose.model(
  "SoftwareApplication",
  new mongoose.Schema({
    name: requiredText("Name"),
    svg: assetFields,
  }),
);
