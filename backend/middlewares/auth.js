import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import { requireOwner } from "../utils/owner.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const bearer = req.headers.authorization?.match(/^Bearer (\S+)$/)?.[1];
  const token = bearer || req.cookies?.token;
  if (!token) throw new ErrorHandler("Please log in.", 401);
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await requireOwner(await User.findById(decoded.id));
  next();
});
