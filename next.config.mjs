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
      { protocol: 'https', hostname: 'upload.wikimedia.org' }, 
    ],
  },
  
  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    
    const scriptSrc = isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://vercel.live https://*.firebaseio.com"
      : "'self' 'unsafe-inline' https://apis.google.com https://accounts.google.com https://www.gstatic.com https://vercel.live https://*.firebaseio.com";
      
    const csp = [
      "default-src 'self'",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline' https://api.fontshare.com",
      "font-src 'self' https://api.fontshare.com https://cdn.fontshare.com https://vercel.live",
      "img-src 'self' data: https://res.cloudinary.com https://firebasestorage.googleapis.com https://lh3.googleusercontent.com https://i.pravatar.cc https://cdn.vectorstock.com https://www.transparenttextures.com https://upload.wikimedia.org https://vercel.com",
      "media-src 'self' https://res.cloudinary.com https://videos.pexels.com",
      "connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://accounts.google.com https://apis.google.com https://vercel.live wss://ws-us3.pusher.com",
      "frame-src 'self' https://maps.google.com https://www.google.com/maps/ https://*.firebaseapp.com https://thecareer-advisors.firebaseapp.com https://accounts.google.com https://apis.google.com https://content.googleapis.com https://vercel.live",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { key: 'Content-Security-Policy', value: csp }
        ],
      },
    ];
  },
};

export default nextConfig;