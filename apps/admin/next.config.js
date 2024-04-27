const { dependencies: deps } = require("./package.json");
const modules = Object.keys(deps).filter((d) => d.includes("@repo/"));

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: modules,
  basePath: "/admin",
};
