export const requiredText = (label) => ({
  type: String,
  trim: true,
  required: [true, `${label} is required.`],
});
export const validWebUrl = (value) => {
  if (!value) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};
export const webUrl = {
  type: String,
  trim: true,
  validate: {
    validator: validWebUrl,
    message: "Enter a valid HTTP or HTTPS URL.",
  },
};
export const assetFields = {
  public_id: { type: String, required: true },
  url: { type: String, required: true },
};
