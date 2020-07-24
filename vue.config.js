console.log(`Nodejs version: ${process.version}.`)

const isProd = process.env.NODE_ENV === 'production'

const serverConfig = () => {
  const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
  const nodeExternals = require('webpack-node-externals')
  return {
    outputDir: 'dist/ssr',
    productionSourceMap: false,
    css: {
      extract: false
    },
    configureWebpack: {
      target: 'node',
      devtool: 'source-map',
      node: false,
      output: {
        libraryTarget: 'commonjs2'
      },
      externals: nodeExternals({
        allowlist: [/\.(css|svg)$/]
      }),
      optimization: {
        minimize: false,
        splitChunks: false
      },
      plugins: [
        new VueSSRServerPlugin()
      ]
    },
    chainWebpack(config) {
      Array(
        'friendly-errors', 'hmr', 'progress', 'copy', 'html', 'prefetch',
        'preload', 'pwa', 'workbox', 'hash-module-ids', 'named-chunks'
      ).forEach(name => {
        config.plugins.delete(name)
      })
      config.module.rules.delete('js')
    }
  }
}

const clientConfig = () => {
  const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
  return {
    configureWebpack: {
      plugins: [
        new VueSSRClientPlugin({ filename: 'ssr/vue-ssr-client-manifest.json' })
      ]
    },
    chainWebpack(config) {
      if (!isProd) { // no need to use babel in development.
        config.module.rules.delete('js')
      }
    }
  }
}

module.exports = () => {
  const config = process.env.VUE_APP_SERVER ? serverConfig() : clientConfig()
  return {
    ...config,
    lintOnSave: false,
    assetsDir: 'assets',
  }
}
