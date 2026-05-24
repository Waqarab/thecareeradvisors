/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configures images to only load from approved domains
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }, 
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, 
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
            value: 'DENY', 
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', 
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', 
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload', 
          },
          { 
            // Content Security Policy to prevent malicious script injections
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://res.cloudinary.com https://firebasestorage.googleapis.com https://lh3.googleusercontent.com; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com;" 
          }
        ],
      },
    ];
  },
};

export default nextConfig;