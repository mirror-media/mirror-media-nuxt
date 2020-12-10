const express = require('express')
const bodyParser = require('body-parser')
const requestIp = require('request-ip')
const consola = require('consola')
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
    })
  )

  app.use(bodyParser.json())
  app.use(requestIp.mw())

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })
}
start()
