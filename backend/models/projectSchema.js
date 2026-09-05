import mongoose from "mongoose";
import { requiredText, webUrl, assetFields } from "./fields.js";
const projectSchema = new mongoose.Schema({
  title: requiredText("Title"),
  description: requiredText("Description"),
  gitRepoLink: { ...webUrl, required: true },
  projectLink: {
    ...webUrl,
    required: function () {
      return this.deployed === "Yes";
    },
  },
  technologies: requiredText("Technologies"),
  stack: requiredText("Stack"),
  deployed: { type: String, enum: ["Yes", "No"], required: true },
  projectBanner: assetFields,
});
export const Project = mongoose.model("Project", projectSchema);
