import preset from "@portfolio/shared/tailwind-preset";
export default {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/@portfolio/shared/src/**/*.{js,jsx}",
  ],
};
