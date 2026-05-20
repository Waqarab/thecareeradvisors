/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configures images to only load from approved domains (Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Injects strict security headers into every page
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Stops other sites from embedding your site in an iframe
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevents browsers from guessing content types
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Protects where your traffic data goes
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload', // Forces HTTPS connections
          },
        ],
      },
    ];
  },
};

export default nextConfig;