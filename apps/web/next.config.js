const { dependencies: deps } = require("./package.json");
const modules = Object.keys(deps).filter((d) => d.includes("@repo/"));

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: modules,
  reactStrictMode: false,
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: `${process.env.NEXT_PUBLIC_ADMIN_URL}/:path*`,
        },
      ],
    };
  },
};
