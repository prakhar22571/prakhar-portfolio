const publicFields = [
  "_id",
  "fullName",
  "aboutMe",
  "portfolioURL",
  "githubURL",
  "instagramURL",
  "twitterURL",
  "facebookURL",
  "linkedInURL",
];
export const profileFields = [
  ...publicFields.filter((key) => key !== "_id"),
  "email",
  "phone",
];

export function serializeProfile(user, { publicOnly = false } = {}) {
  if (!user) return null;
  const fields = publicOnly
    ? publicFields
    : [...publicFields, "email", "phone"];
  const result = Object.fromEntries(
    fields
      .filter((key) => user[key] !== undefined)
      .map((key) => [key, user[key]]),
  );
  for (const key of ["avatar", "resume"]) {
    if (user[key]?.url) result[key] = { url: user[key].url };
  }
  return result;
}

export function pickFields(body, fields) {
  return Object.fromEntries(
    fields
      .filter((key) => body[key] !== undefined)
      .map((key) => [key, body[key]]),
  );
}
