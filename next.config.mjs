/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Admin can paste any image URL or upload to Vercel Blob, so allow any
    // https host (and http for local/dev sources).
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
