export default class ErrorHandler extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (error, req, res, next) => {
  if (res.headersSent) return next(error);
  let status = error.statusCode || 500;
  let message = error.message || "Internal Server Error";
  if (error.code === 11000) {
    status = 400;
    message = `Duplicate ${Object.keys(error.keyValue || {}).join(", ")} entered`;
  } else if (["JsonWebTokenError", "TokenExpiredError"].includes(error.name)) {
    status = 401;
    message = "Your session is invalid or expired. Please log in again.";
  } else if (error.name === "CastError") {
    status = 400;
    message = `Invalid ${error.path}`;
  } else if (error.name === "ValidationError") {
    status = 400;
    message = Object.values(error.errors)
      .map((item) => item.message)
      .join(" ");
  }
  if (status >= 500) {
    console.error(error);
    message = "The request could not be completed. Please try again.";
  }
  return res.status(status).json({ success: false, message });
};
