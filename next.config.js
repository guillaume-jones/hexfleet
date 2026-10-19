const basePath = '/hexfleet';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  output: 'export',
  images: { unoptimized: true },
  transpilePackages: [],
};

module.exports = nextConfig;
