import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Preserve existing single-user installations, but never guess between accounts.
export async function getOwnerId() {
  if (process.env.PORTFOLIO_OWNER_ID) return process.env.PORTFOLIO_OWNER_ID;
  const users = await User.find().select("_id").limit(2);
  if (users.length > 1)
    throw new ErrorHandler(
      "Configure PORTFOLIO_OWNER_ID before serving multiple accounts.",
      503,
    );
  return users[0]?._id?.toString() || null;
}

export async function requireOwner(user) {
  if (!user) throw new ErrorHandler("Please log in again.", 401);
  if (user._id.toString() !== (await getOwnerId()))
    throw new ErrorHandler(
      "Only the portfolio owner can access the dashboard.",
      403,
    );
  return user;
}
