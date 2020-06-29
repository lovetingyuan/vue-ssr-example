const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const JoiRouter = require('koa-joi-router')
const serveStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const { createBundleRenderer } = require('vue-server-renderer')
const LRU = require('lru-cache')

const app = new Koa()
const router = JoiRouter()
const port = process.env.PORT || 8081
const ssrRoutes = [
  '/', '/about'
]

const serverBundle = require('./dist/ssr/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/ssr/vue-ssr-client-manifest.json')
const templatePath = path.resolve('./dist/ssr/index.html')
const indexHTML = fs.readFileSync(templatePath, 'utf8')

const microCache = new LRU({
  max: 1024 * 1024 * 500,
  maxAge: 60 * 1000
})

const renderer = createBundleRenderer(serverBundle, {
  template: indexHTML,
  runInNewContext: false,
  clientManifest
})

function SSRMiddleware (ctx) {
  console.log('Request route: ' + ctx.request.href)
  const cacheUrl = ctx.request.href
  const hit = microCache.get(cacheUrl)
  if (hit) {
    ctx.type = 'html'
    ctx.body = hit
    return
  }
  return renderer.renderToString({
    url: ctx.url
  }).then(html => {
    ctx.type = 'html'
    ctx.body = html
    microCache.set(cacheUrl, html)
  })
}

ssrRoutes.forEach(route => {
  router.get(route, SSRMiddleware)
})

app.use(bodyParser())
app.use(router.middleware())
app.use(serveStatic('./dist'))

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error('SSR error: ', err)
    if (err && err.status === 404) {
      ctx.throw(404)
    } else {
      ctx.throw((err && err.status) || 500, (err && err.message) || 'Unknown Server Error.')
    }
  }
})

app.listen(port)

console.log('SSR server starts at: http://localhost:' + port)
