import axios from 'axios'
import errors from '@twreporter/errors'
import { API_PATH_FRONTEND } from '../configs/config.js'

const baseUrl = 'http://localhost:3000/'

/**
 * Create an express middleware to verify token in request header with Firebase
 * @return {express.RequestHandler} express middleware
 */
export default function requestAuthentication() {
  return async (req, res, next) => {
    const bearerHeader = req.headers?.authorization

    if (bearerHeader === undefined) {
      res.status(400).json({
        status: 'fail',
        data: {
          title: 'Autorization header is required.',
        },
      })
      return
    }

    const requestUrl = `${baseUrl}${API_PATH_FRONTEND}/membership/v1/tokenState`
    const requestConfig = {
      headers: {
        Authorization: bearerHeader,
      },
    }

    try {
      const { data } = await axios.get(requestUrl, requestConfig)

      if (data.tokenState !== 'OK') {
        res.status(401).json({
          status: 'fail',
          data: {
            title: 'Authentication failed',
          },
        })
        return
      }
    } catch (error) {
      const annotatingError = errors.helpers.wrap(
        error,
        'requestAuthenticationMiddleware',
        'Encounter an error on token authentication.'
      )
      // eslint-disable-next-line no-console
      console.error(
        JSON.stringify({
          severity: 'ERROR',
          message: errors.helpers.printAll(annotatingError, {
            withStack: true,
            withPayload: true,
          }),
        })
      )

      res.status(500).json({
        status: 'error',
        message: 'Encounter an error on token authentication.',
      })
      return
    }

    next()
  }
}
