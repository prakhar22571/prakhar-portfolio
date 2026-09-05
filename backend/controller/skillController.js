import { Skill } from "../models/skillSchema.js";
import { imageResource } from "./imageResource.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
const resource = imageResource({
  Model: Skill,
  fields: ["title", "proficiency"],
  folder: "PORTFOLIO SKILL IMAGES",
  singular: "skill",
  plural: "skills",
  label: "Skill",
});
export const addNewSkill = resource.add;
export const deleteSkill = resource.remove;
export const getAllSkills = resource.list;
export const updateSkill = catchAsyncErrors(async (req, res) => {
  if (req.body.proficiency === undefined || req.body.proficiency === "")
    throw new ErrorHandler("Proficiency is required.");
  const skill = await Skill.findByIdAndUpdate(
    req.params.id,
    { proficiency: req.body.proficiency },
    { new: true, runValidators: true },
  );
  if (!skill) throw new ErrorHandler("Skill not found.", 404);
  res.json({ success: true, message: "Skill updated.", skill });
});
