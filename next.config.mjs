/** @type {import('next').NextConfig} */
const rutaBase = process.env.NEXT_PUBLIC_BASE_PATH || "";

const configuracionNext = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  basePath: rutaBase,
  assetPrefix: rutaBase || undefined,
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default configuracionNext;
