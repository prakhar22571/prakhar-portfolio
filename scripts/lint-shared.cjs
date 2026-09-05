const path = require("node:path");
const { ESLint } = require("../dashboard/node_modules/eslint");
(async () => {
  const eslint = new ESLint({
    cwd: path.resolve(__dirname, "../shared"),
    overrideConfigFile: path.resolve(__dirname, "../dashboard/.eslintrc.cjs"),
    resolvePluginsRelativeTo: path.resolve(__dirname, "../dashboard"),
  });
  const results = await eslint.lintFiles(["src/**/*.{js,jsx}", "*.cjs"]);
  const formatter = await eslint.loadFormatter("stylish");
  process.stdout.write(formatter.format(results));
  process.exitCode = results.some(
    (result) => result.errorCount || result.warningCount,
  )
    ? 1
    : 0;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
