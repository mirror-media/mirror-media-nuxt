const express = require('express')
const bodyParser = require('body-parser')
const requestIp = require('request-ip')
const consola = require('consola')
const { createHttpTerminator } = require('http-terminator')
const { loadNuxt, build } = require('nuxt')
const app = express()

const helmet = require('helmet')
const isDev = process.env.NODE_ENV !== 'production'

async function start() {
  const nuxt = await loadNuxt(isDev ? 'dev' : 'start')

  const { host, port } = nuxt.options.server

  if (isDev) {
    build(nuxt)
  }

  app.use(
    helmet({
      contentSecurityPolicy: false,
      referrerPolicy: false,
      noSniff: false,
      frameguard: false,
    })
  )

  app.use(bodyParser.json())
  app.use(requestIp.mw())

  app.get('/robots.txt', (req, res, next) => {
    if (process.env.ENV === 'prod') {
      res.type('text/plain').send('User-agent: * \n' + 'Allow: /')
      return
    }
    if (process.env.ENV !== 'prod') {
      res.type('text/plain').send('User-agent: * \n' + 'Disallow: /')
      return
    }
    next()
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  const server = app.listen(port, host)

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })

  /**
   * Graceful shutdown
   * https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
   */
  process.on('SIGTERM', async function gracefulShutdown() {
    const httpTerminator = createHttpTerminator({ server })
    await httpTerminator.terminate()
  })
}

start()
