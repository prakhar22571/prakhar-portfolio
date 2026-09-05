import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import { imageResource } from "./imageResource.js";
const resource = imageResource({
  Model: SoftwareApplication,
  fields: ["name"],
  folder: "PORTFOLIO SOFTWARE APPLICATION IMAGES",
  singular: "softwareApplication",
  plural: "softwareApplications",
  label: "Application",
});
export const addNewApplication = resource.add;
export const deleteApplication = resource.remove;
export const getAllApplications = resource.list;
