const withPreact = require('next-plugin-preact')

const nextConfig = {
  webpack(config, { dev, isServer }) {
    // Generate Sitemap + RSS on build time
    if (isServer) {
      require('./utils/generateSitemap')()
      require('./utils/generateRss')()
    }

    return config
  },
}

module.exports = withPreact(nextConfig)
