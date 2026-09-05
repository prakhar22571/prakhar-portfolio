import { serializeProfile } from "./profile.js";

export const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  };
};

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  res
    .status(statusCode)
    .cookie("token", token, {
      ...cookieOptions(),
      expires: new Date(
        Date.now() +
          Number(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000,
      ),
    })
    .json({
      success: true,
      message,
      user: serializeProfile(user),
      token,
    });
};
