module.exports = {
  experimental: {
    modern: true,
  },
  webpack(config, { isServer }) {
    // Generate Sitemap + RSS on build time
    if (isServer) {
      require('./utils/generateSitemap')()
      require('./utils/generateRss')()
    }

    // Preact
    const splitChunks = config.optimization && config.optimization.splitChunks
    if (splitChunks) {
      const cacheGroups = splitChunks.cacheGroups
      const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/
      if (cacheGroups.framework) {
        cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
          test: preactModules,
        })
        cacheGroups.commons.name = 'framework'
      } else {
        cacheGroups.preact = {
          name: 'commons',
          chunks: 'all',
          test: preactModules,
        }
      }
    }

    return config
  },
}
