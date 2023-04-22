const nextConfig = {
  experimental: { appDir: true },
  webpack(config, { dev, isServer }) {
    // Generate Sitemap + RSS on build time
    if (isServer) {
      require('./utils/generateSitemap')()
      require('./utils/generateRss')()
    }

    return config
  },
}

module.exports = nextConfig
