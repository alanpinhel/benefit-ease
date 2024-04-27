/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
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
