/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverExternalPackages: ['mongoose']
    },
    images: {
        domains: ['m.media-amazon.com']
    }
}

module.exports = nextConfig
