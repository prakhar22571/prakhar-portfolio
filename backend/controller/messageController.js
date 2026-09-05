import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { pickFields } from "../utils/profile.js";
export const sendMessage = catchAsyncErrors(async (req, res) => {
  const data = await Message.create(
    pickFields(req.body, ["senderName", "subject", "message"]),
  );
  res.status(201).json({ success: true, message: "Message sent.", data });
});
export const deleteMessage = catchAsyncErrors(async (req, res) => {
  if (!(await Message.findByIdAndDelete(req.params.id)))
    throw new ErrorHandler("Message not found.", 404);
  res.json({ success: true, message: "Message deleted." });
});
export const getAllMessages = catchAsyncErrors(async (req, res) => {
  res.json({
    success: true,
    messages: await Message.find().sort({ createdAt: -1 }),
  });
});
