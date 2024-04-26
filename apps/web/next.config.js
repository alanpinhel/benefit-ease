/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: "/admin/:path*",
        destination: `${process.env.NEXT_PUBLIC_ADMIN_URL}/admin/:path*`,
      },
    ];
  },
};
