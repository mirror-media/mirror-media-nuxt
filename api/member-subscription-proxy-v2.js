/*
 * This api endpoint might replace v0 in the future.
 * The adventage of this endpoint is removing dependacies on apigateway.
 */

import express from 'express'
import { ISRAFEL_ORIGIN } from '../configs/config.js'
import requestAuthentication from '../serverMiddleware/requestAuthentication.js'
import { createProxy } from './helpers'

const app = express()
app.use(requestAuthentication())
app.use('/', createProxy(`${ISRAFEL_ORIGIN}/api/graphql/member`))

module.exports = app
