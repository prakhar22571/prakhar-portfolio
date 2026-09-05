import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Timeline } from "../models/timelineSchema.js";
export const postTimeline = catchAsyncErrors(async (req, res) => {
  const { title, description, from, to } = req.body;
  const newTimeline = await Timeline.create({
    title,
    description,
    timeline: { from, to },
  });
  res
    .status(201)
    .json({ success: true, message: "Timeline added.", newTimeline });
});
export const deleteTimeline = catchAsyncErrors(async (req, res) => {
  if (!(await Timeline.findByIdAndDelete(req.params.id)))
    throw new ErrorHandler("Timeline not found.", 404);
  res.json({ success: true, message: "Timeline deleted." });
});
export const getAllTimelines = catchAsyncErrors(async (req, res) => {
  res.json({
    success: true,
    timelines: await Timeline.find().sort({ _id: -1 }),
  });
});
