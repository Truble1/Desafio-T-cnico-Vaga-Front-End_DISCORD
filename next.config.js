/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api-teste-front-production.up.railway.app'],
  },
  experimental: {
    optimizePackageImports: ['@heroui/react', 'lucide-react'],
  },
  reactStrictMode: true,
}

module.exports = nextConfig