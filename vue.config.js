const webpack = require('webpack')
const pkg = require('./package.json')

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
      output: {
        libraryTarget: 'commonjs2'
      },
      externals: nodeExternals({
        whitelist: /\.(css|svg)$/
      }),
      optimization: {
        minimize: false,
        splitChunks: false
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            VUE_ENV: JSON.stringify('server')
          }
        }),
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
      config.module.rule('js').uses.delete('babel-loader')
    }
  }
}

const clientConfig = () => {
  const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
  return {
    configureWebpack: {
      optimization: {
        runtimeChunk: {
          name: 'manifest'
        }
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            VUE_ENV: false
          }
        }),
        {
          apply(compiler) {
            const filename = 'ssr/vue-ssr-client-manifest.json';
            new VueSSRClientPlugin({ filename }).apply(compiler)
            const ID = 'ssr-client-webpack-plugin-fix'
            compiler.hooks.emit.tapAsync(ID, (compilation, callback) => {
              let manifest = JSON.parse(compilation.assets[filename].source())
              manifest.all = manifest.all.filter(v => !v.endsWith('.css.map'))
              Object.keys(manifest.modules).forEach(mid => {
                manifest.modules[mid] = manifest.modules[mid].filter(v => v !== -1)
              })
              manifest = JSON.stringify(manifest)
              compilation.assets[filename] = {
                source() { return manifest },
                size() { return manifest.length }
              }
              callback()
            })
          }
        }
      ]
    },
    chainWebpack(config) {
      config.plugin('html').tap(args => {
        args[0].title = pkg.name + '_' + pkg.version
        return args
      })
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
