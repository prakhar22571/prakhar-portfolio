import crypto from "node:crypto";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken, cookieOptions } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import {
  serializeProfile,
  profileFields,
  pickFields,
} from "../utils/profile.js";
import { saveWithAssets } from "../utils/assets.js";
import { getOwnerId, requireOwner } from "../utils/owner.js";

export const login = catchAsyncErrors(async (req, res) => {
  const { email, password } = req.body;
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  )
    throw new ErrorHandler("Provide email and password.");
  const user = await User.findOne({ email: email.trim() }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    throw new ErrorHandler("Invalid email or password.", 401);
  await requireOwner(user);
  generateToken(user, "Logged in.", 200, res);
});
export const logout = (req, res) =>
  res
    .cookie("token", "", { ...cookieOptions(), expires: new Date(0) })
    .json({ success: true, message: "Logged out." });
export const getUser = (req, res) =>
  res.json({ success: true, user: serializeProfile(req.user) });

export const updateProfile = catchAsyncErrors(async (req, res) => {
  const user = req.user;
  const previous = {
    avatar: user.avatar?.toObject?.() || user.avatar,
    resume: user.resume?.toObject?.() || user.resume,
  };
  user.set(pickFields(req.body, profileFields));
  const uploads = [
    {
      key: "avatar",
      file: req.files?.avatar,
      folder: "PORTFOLIO AVATAR",
      kind: "image",
    },
    {
      key: "resume",
      file: req.files?.resume,
      folder: "PORTFOLIO RESUME",
      kind: "pdf",
    },
  ].filter((upload) => upload.file);
  await saveWithAssets({
    uploads,
    previous,
    save: (assets) => {
      user.set(assets);
      return user.save();
    },
  });
  res.json({
    success: true,
    message: "Profile updated.",
    user: serializeProfile(user),
  });
});
export const updatePassword = catchAsyncErrors(async (req, res) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (
    ![currentPassword, newPassword, confirmNewPassword].every(
      (value) => typeof value === "string" && value,
    )
  )
    throw new ErrorHandler("Fill all password fields.");
  const user = await User.findById(req.user.id).select("+password");
  if (!user) throw new ErrorHandler("Please log in again.", 401);
  if (!(await user.comparePassword(currentPassword)))
    throw new ErrorHandler("Incorrect current password.");
  if (newPassword !== confirmNewPassword)
    throw new ErrorHandler("New passwords do not match.");
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: "Password updated." });
});
export const getUserForPortfolio = catchAsyncErrors(async (req, res) => {
  const ownerId = await getOwnerId();
  const user = ownerId ? await User.findById(ownerId) : null;
  if (!user) throw new ErrorHandler("Portfolio profile not found.", 404);
  res.json({
    success: true,
    user: serializeProfile(user, { publicOnly: true }),
  });
});
export const forgotPassword = catchAsyncErrors(async (req, res) => {
  if (typeof req.body.email !== "string" || !req.body.email.trim())
    throw new ErrorHandler("Enter your email.");
  const user = await User.findOne({ email: req.body.email.trim() });
  const ownerId = await getOwnerId();
  const message =
    "If this is the portfolio owner's email, a reset link has been sent.";
  if (!user || user.id !== ownerId) return res.json({ success: true, message });
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  try {
    await sendEmail({
      email: user.email,
      subject: "Portfolio password recovery",
      message: `Reset your password: ${process.env.DASHBOARD_URL}/password/reset/${resetToken}\n\nIgnore this email if you did not request it.`,
    });
    res.json({ success: true, message });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    throw error;
  }
});
export const resetPassword = catchAsyncErrors(async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (typeof password !== "string" || !password || password !== confirmPassword)
    throw new ErrorHandler("Enter matching passwords.");
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) throw new ErrorHandler("Reset link is invalid or expired.");
  await requireOwner(user);
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  generateToken(user, "Password reset.", 200, res);
});
