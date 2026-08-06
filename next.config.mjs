/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow optimizing images from local /public/images folder.
    // If you later host images on a CDN, add the domain here, e.g.:
    // remotePatterns: [{ protocol: 'https', hostname: 'images.yourcdn.com' }],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
