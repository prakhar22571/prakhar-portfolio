export const profileFields = [
  { key: "fullName", label: "Full name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "tel", required: true },
  { key: "aboutMe", label: "About me", multiline: true, required: true },
  { key: "portfolioURL", label: "Portfolio URL", type: "url", required: true },
  ...[
    ["githubURL", "GitHub"],
    ["linkedInURL", "LinkedIn"],
    ["instagramURL", "Instagram"],
    ["twitterURL", "Twitter (X)"],
    ["facebookURL", "Facebook"],
  ].map(([key, label]) => ({ key, label: label + " URL", type: "url" })),
];
export function profileValues(user) {
  return Object.fromEntries(
    profileFields.map(({ key }) => [
      key,
      user[key] && user[key] !== "undefined" ? user[key] : "",
    ]),
  );
}
