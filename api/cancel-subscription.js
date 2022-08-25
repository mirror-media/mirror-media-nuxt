import express from 'express'
import errors from '@twreporter/errors'
import { ISRAFEL_ORIGIN } from '../configs/config.js'
import requestAuthentication from '../serverMiddleware/requestAuthentication.js'
import { STATUS as REQUEST_STATUS } from '../constants/request.js'
import { fireGqlRequest, sendResponse } from './helpers'

/**
 *  @typedef {import('express').Request} Request
 *  @typedef {import('express').Response} Response
 */

const apiUrl = `${ISRAFEL_ORIGIN}/api/graphql`

const app = express()
app.use(requestAuthentication())

/**
 *  API endpoint for cancelling member's subscription
 *
 *  @param {Request} req
 *  @param {Response} res
 *  @return {void}
 */
app.post('/', async (req, res) => {
  try {
    // check query parameters
    const { firebaseId, note } = req.body

    if (!firebaseId) {
      return sendResponse({
        status: REQUEST_STATUS.FAIL,
        data: {
          title: `Missing query parameter.`,
        },
        res,
      })
    }

    // retrieve subscription data from back-end
    const fetchRecurringSubscription = `
      query ($firebaseId: String!) { 
        member(where: { firebaseId: $firebaseId }) {
          email
          type
          subscriptions: subscription(
            first: 1
            where: { frequency_in: [yearly, monthly], isActive: true }
            orderBy: { periodEndDatetime: desc }
          ) {
            id
            isCanceled
            frequency
            nextFrequency
            orderNumber
            paymentMethod
            linepayPaymentInfo {
              id
              regKey
            }
          }
        }
      }
    `

    const {
      data: {
        member: { subscriptions },
      },
    } = await fireGqlRequest(
      fetchRecurringSubscription,
      {
        firebaseId,
      },
      apiUrl
    )

    const subscription = subscriptions[0]

    if (!subscription) {
      return sendResponse({
        status: REQUEST_STATUS.FAIL,
        data: {
          title: `No valid subscription record`,
        },
        res,
      })
    }

    // change subscription.isCanceled to true (carry unsubscribe reason)
    const unsubscribe = ` 
      mutation ($id: ID!, $note: String) {
        updatesubscription(id: $id, data: { isCanceled: true, note: $note }) {
          id
          frequency
          isActive
          isCanceled
          note
        }
      }
    `

    const result = await fireGqlRequest(
      unsubscribe,
      {
        id: subscription.id,
        note,
      },
      apiUrl
    )

    sendResponse({
      status: REQUEST_STATUS.SUCCESS,
      data: {
        title: 'Succeed in cancelling subscription.',
        data: result.data?.updatesubscription,
      },
      res,
    })
  } catch (error) {
    const annotatingError = errors.helpers.wrap(
      error,
      'api/cancel-subscription',
      'Encounter error on cancelling subscription'
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

    sendResponse({
      status: REQUEST_STATUS.ERROR,
      message: 'Encounter error on cancelling subscription.',
      code: 500,
      res,
    })
  }
})

module.exports = app
