/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // This allows ANY https image URL. For strict security later, replace '**' with specific domains like 'images.unsplash.com'
      },
    ],
  },
};

export default nextConfig;