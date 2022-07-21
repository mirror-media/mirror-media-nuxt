/*
 * This api endpoint is served as a proxy between front-end page and Israfel GraphQL api endpoint.
 * This api is built with request authenication by verifing header of request.
 * GraphQL request related to member list use this endpoint is recommanded.
 * Customized query or mutation in apigateway should migrat to this endpoint in the future.
 * This endpoint might replace v0 in the future.
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
