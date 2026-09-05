import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { requiredText, webUrl, assetFields } from "./fields.js";
const userSchema = new mongoose.Schema({
  fullName: requiredText("Name"),
  email: {
    ...requiredText("Email"),
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email."],
  },
  phone: requiredText("Phone"),
  aboutMe: requiredText("About me"),
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must contain at least 8 characters."],
    select: false,
  },
  avatar: assetFields,
  resume: assetFields,
  portfolioURL: { ...webUrl, required: true },
  githubURL: webUrl,
  instagramURL: webUrl,
  twitterURL: webUrl,
  linkedInURL: webUrl,
  facebookURL: webUrl,
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },
});
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};
userSchema.methods.getResetPasswordToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return token;
};
export const User = mongoose.model("User", userSchema);
