module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'data',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_ACCESS_PASSWORD: process.env.ACCESS_PASSWORD,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
}; 