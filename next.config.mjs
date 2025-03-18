/*
Configures Next.js for the app.
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { remotePatterns: [{ hostname: "localhost" }] },
  webpack: config => {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader"
    })
    return config
  }
}

export default nextConfig
