/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }, 
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, 
      { protocol: 'https', hostname: 'i.pravatar.cc' }, 
      { protocol: 'https', hostname: 'cdn.vectorstock.com' }, 
      { protocol: 'https', hostname: 'www.transparenttextures.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' }, // Allowed Wikimedia for flags
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
          { 
            // UPDATED CONTENT SECURITY POLICY
            // Added https://upload.wikimedia.org to the img-src list
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://res.cloudinary.com https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://i.pravatar.cc https://cdn.vectorstock.com https://www.transparenttextures.com https://upload.wikimedia.org; media-src 'self' https://res.cloudinary.com https://videos.pexels.com; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com; frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/ https://maps.google.com https://www.google.com/maps/ http://googleusercontent.com;" 
          }
        ],
      },
    ];
  },
};

export default nextConfig;