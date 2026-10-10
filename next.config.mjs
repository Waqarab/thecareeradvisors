/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }, 
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, 
      { protocol: 'https', hostname: 'i.pravatar.cc' }, 
      { protocol: 'https', hostname: 'cdn.vectorstock.com' }, 
      { protocol: 'https', hostname: 'www.transparenttextures.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' }, 
    ],
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'X-XSS-Protection', value: '0' }
        ],
      },
    ];
  },
};

export default nextConfig;