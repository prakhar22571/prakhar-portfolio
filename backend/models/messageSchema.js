import mongoose from "mongoose";
import { requiredText } from "./fields.js";
const messageSchema = new mongoose.Schema({
  senderName: { ...requiredText("Name"), minLength: 2 },
  subject: { ...requiredText("Subject"), minLength: 2 },
  message: { ...requiredText("Message"), minLength: 2 },
  createdAt: { type: Date, default: Date.now },
});
export const Message = mongoose.model("Message", messageSchema);
