import withPWA from 'next-pwa';

// Define the Next.js configuration with PWA support
const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

// Export the configuration as default
export default nextConfig;