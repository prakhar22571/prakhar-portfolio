import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Project } from "../models/projectSchema.js";
import { saveWithAssets, removeAsset } from "../utils/assets.js";
import { pickFields } from "../utils/profile.js";

const fields = [
  "title",
  "description",
  "gitRepoLink",
  "projectLink",
  "stack",
  "technologies",
  "deployed",
];
const bannerUpload = (file) => ({
  key: "projectBanner",
  file,
  folder: "PORTFOLIO PROJECT IMAGES",
});

export const addNewProject = catchAsyncErrors(async (req, res) => {
  const project = await saveWithAssets({
    uploads: [bannerUpload(req.files?.projectBanner)],
    save: (assets) =>
      Project.create({ ...pickFields(req.body, fields), ...assets }),
  });
  res
    .status(201)
    .json({ success: true, message: "New project added.", project });
});
export const updateProject = catchAsyncErrors(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ErrorHandler("Project not found.", 404);
  const previous = {
    projectBanner: project.projectBanner?.toObject?.() || project.projectBanner,
  };
  project.set(pickFields(req.body, fields));
  await saveWithAssets({
    uploads: req.files?.projectBanner
      ? [bannerUpload(req.files.projectBanner)]
      : [],
    previous,
    save: (assets) => {
      project.set(assets);
      return project.save();
    },
  });
  res.json({ success: true, message: "Project updated.", project });
});
export const deleteProject = catchAsyncErrors(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) throw new ErrorHandler("Project not found.", 404);
  // The record is gone first; a cleanup failure must not strand a live record.
  try {
    await removeAsset(project.projectBanner);
  } catch (error) {
    console.error(
      "Project asset cleanup failed:",
      project.projectBanner?.public_id,
      error.message,
    );
  }
  res.json({ success: true, message: "Project deleted." });
});
export const getAllProjects = catchAsyncErrors(async (req, res) => {
  res.json({ success: true, projects: await Project.find() });
});
export const getSingleProject = catchAsyncErrors(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ErrorHandler("Project not found.", 404);
  res.json({ success: true, project });
});
