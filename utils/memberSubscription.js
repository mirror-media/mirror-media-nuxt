import { print } from 'graphql/language/printer'
import axios from 'axios'
import {
  fetchMemberSubscriptions,
  fetchMemberBasicInfo,
  fetchOneTimeSubscriptions,
  fetchSubscriptionPayments,
  fetchRecurringSubscription,
} from '~/apollo/queries/memberSubscriptionQuery.gql'
import {
  setMemberTosToTrue,
  unsubscribe,
  fetchPaymentDataOfSubscriptionRecurring,
  fetchPaymentDataOfSubscriptionOneTime,
} from '~/apollo/mutations/memberSubscriptionMutation.gql'

import { API_PATH_FRONTEND } from '~/configs/config.js'
const baseUrl = process.browser
  ? `//${location.host}/`
  : 'http://localhost:3000/'
const apiUrl = `${baseUrl}${API_PATH_FRONTEND}/member-subscription/v0`

async function getMemberType(context) {
  // determine whether user is logged in or not
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return 'not-member' // no user is logged in

  try {
    const {
      data: { member: memberBasicInfo },
    } = await fireGqlRequest(fetchMemberBasicInfo, { firebaseId }, context)
    return formatMemberType(memberBasicInfo.type)
  } catch (error) {
    console.error(error)
    return 'not-member'
  }
}

function formatMemberType(israfelMemberType) {
  switch (israfelMemberType) {
    case 'subscribe_one_time':
    case 'one_time':
    case 'single-post':
      return 'basic'

    case 'subscribe_monthly':
    case 'month':
    case 'monthly':
      return 'month'

    case 'subscribe_yearly':
    case 'year':
    case 'yearly':
      return 'year'

    case 'marketing':
      return 'marketing'
    case 'none':
    default:
      return 'basic'
  }
}

async function getMemberDetailData(context) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  try {
    const result = await fireGqlRequest(
      fetchMemberSubscriptions,
      {
        firebaseId,
      },
      context
    )

    const memberData = result?.data?.member
    return memberData
  } catch (error) {
    console.error(error)
    return {}
  }
}

async function cancelMemberSubscription(context, reason) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  try {
    // get user's newest subscription
    const subscriptions = await getMemberAllSubscriptions(firebaseId, context)
    const newestSubscription = subscriptions[0]

    if (newestSubscription.frequency === 'one_time') return

    // change subscription.isCanceled to true (carry unsubscribe reason)
    await fireGqlRequest(
      unsubscribe,
      {
        id: newestSubscription.id,
        note: reason,
      },
      context
    )

    return 'success'
  } catch (error) {
    console.error(error)
    return 'fail'
  }
}

async function getMemberAllSubscriptions(firebaseId, context) {
  try {
    // get user's subscription state
    const result = await fireGqlRequest(
      fetchMemberSubscriptions,
      {
        firebaseId,
      },
      context
    )

    // get member's all subscriptions
    const subscriptions = result?.data?.member?.subscription

    return subscriptions || []
  } catch (error) {
    // handle network error
    console.error(error)

    return []
  }
}

function getUserFirebaseId(context) {
  const currentUserUid = context.store?.state?.membership?.userUid

  return currentUserUid || null
}

async function fireGqlRequest(query, variables, context) {
  const firebaseToken = getFirebaseToken(context)

  const { data: result } = await axios({
    url: apiUrl,
    method: 'post',
    data: {
      query: print(query),
      variables,
    },
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`,
    },
  })

  if (result.errors) {
    throw new Error(result.errors[0].message)
  }

  return result
}

function getMemberPayRecords(subscriptionList) {
  if (!subscriptionList?.length) return []

  const payRecords = []

  subscriptionList.forEach((subscription) => {
    subscription.newebpayPayment?.forEach((newebpayPayment) => {
      const payRecord = {
        number: subscription.orderNumber,
        date: getFormatDate(newebpayPayment.paymentTime),
        type: getSubscriptionType(subscription.frequency),
        method: newebpayPayment.paymentMethod,
        methodNote: `(${newebpayPayment.cardInfoLastFour || ''})`,
        price: newebpayPayment.amount,
      }
      payRecords.push(payRecord)
    })
  })

  // sort all records by date_dsc
  payRecords.sort((recordA, recordB) => {
    return new Date(recordB.date) - new Date(recordA.date)
  })

  return payRecords
}

function getSubscriptionType(type) {
  switch (type) {
    case 'yearly':
      return '年訂閱'
    case 'monthly':
      return '月訂閱'
    case 'one_time':
      return '單篇訂閱'
    default:
      break
  }
}

function getFormatDate(dateString) {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)

  return `${year}/${month}/${day}`
}

/*
 * Hint: How to verify member is premium or not?
 * https://mirrormedia.slack.com/archives/C028CE3BGA1/p1630551612076200
 */

async function getMemberServiceRuleStatus(context) {
  // determine whether user is logged in or not
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  // get user's subscription state
  try {
    const result = await fireGqlRequest(
      fetchMemberBasicInfo,
      {
        firebaseId,
      },
      context
    )

    // check member's tos
    const member = result?.data?.member
    return !!member.tos
  } catch (error) {
    console.error(error)
    return false
  }
}

async function setMemberServiceRuleStatusToTrue(context) {
  // determine whether user is logged in or not
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  // get member's israfel ID
  const memberIsrafelId = await getMemberIsrafelId(firebaseId, context)

  // TODO： put member's israfelID to vuex

  // fire mutation, set member's tos(service rule) to true
  try {
    const result = await fireGqlRequest(
      setMemberTosToTrue,
      {
        id: memberIsrafelId,
      },
      context
    )

    // check member's tos
    const member = result?.data?.updatemember
    return !!member.tos
  } catch (error) {
    console.error(error)
  }
}

async function getMemberIsrafelId(firebaseId, context) {
  // TODO： put member's israfelID to vuex
  const result = await fireGqlRequest(
    fetchMemberBasicInfo,
    {
      firebaseId,
    },
    context
  )
  const memberIsrafelId = result?.data?.member?.id
  return memberIsrafelId
}

function getFirebaseToken(context) {
  return context.store?.state?.membership?.userToken
}

async function isMemberPaidSubscriptionWithMobile(context) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  try {
    // get user's newest subscription
    const subscriptions = await getMemberAllSubscriptions(firebaseId)
    return isSubscriptionPayByMobileAppStore(subscriptions[0])
  } catch (error) {
    console.error(error)
    return false
  }
}

function isSubscriptionPayByMobileAppStore(subscription) {
  const { frequency, paymentMethod } = subscription
  if (frequency === 'one_time') return false

  return paymentMethod === 'applepay' || paymentMethod === 'applepay'
}

async function getPaymentDataOfSubscription(context, gateWayPayload) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  try {
    const { frequency } = gateWayPayload
    let query
    if (frequency === 'yearly' || frequency === 'monthly') {
      query = fetchPaymentDataOfSubscriptionRecurring
    } else {
      query = fetchPaymentDataOfSubscriptionOneTime
    }

    return await fireGqlRequest(query, gateWayPayload, context)
  } catch (error) {
    console.error(error)
    return null
  }
}

async function getMemberOneTimeSubscriptions(context, loadmoreConfig) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  try {
    // get user's subscription state
    const result = await fireGqlRequest(
      fetchOneTimeSubscriptions,
      {
        firebaseId,
      },
      context
    )

    // get member's all subscriptions
    const subscriptions = result?.data?.member?.subscription
    return getMemberSubscribePosts(subscriptions)
  } catch (error) {
    // handle network error
    console.error(error)

    return []
  }
}

function getMemberSubscribePosts(subscriptionList) {
  if (!subscriptionList.length) return []
  const postList = []
  subscriptionList.forEach((subscription) => {
    const post = {
      id: subscription.postId,
      title: subscription.postId,
      url: '/',
      deadline: getFormatDate(subscription.oneTimeEndDatetime),
    }
    postList.push(post)
  })
  return postList
}

async function getSubscriptionRecurring(context, loadmoreConfig) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  try {
    // get user's subscription state
    const {
      data: {
        member: { subscription },
      },
    } = await fireGqlRequest(
      fetchRecurringSubscription,
      {
        firebaseId,
      },
      context
    )
    const {
      frequency,
      periodEndDatetime,
      periodNextPayDatetime,
      newebpayPayment,
    } = subscription[0]
    const { paymentMethod, cardInfoLastFour } = newebpayPayment[0]

    return {
      frequency: formatMemberType(frequency),
      dueDate: `至 ${getFormatDate(periodEndDatetime)}`,
      nextPayDate: getFormatDate(periodNextPayDatetime),
      paymentMethod: `${paymentMethod}(${cardInfoLastFour})`,
    }
  } catch (error) {
    // handle network error
    console.error(error)

    return {}
  }
}
async function getSubscriptionPayments(context, loadmoreConfig) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  try {
    // get user's subscription state
    const result = await fireGqlRequest(
      fetchSubscriptionPayments,
      {
        firebaseId,
      },
      context
    )

    // get member's all subscriptions
    const subscriptions = result?.data?.member?.subscription
    return getMemberPayRecords(subscriptions)
  } catch (error) {
    // handle network error
    console.error(error)

    return []
  }
}

export {
  getMemberDetailData,
  getMemberServiceRuleStatus,
  setMemberServiceRuleStatusToTrue,
  cancelMemberSubscription,
  isMemberPaidSubscriptionWithMobile,
  isSubscriptionPayByMobileAppStore,
  getMemberType,
  getPaymentDataOfSubscription,
  formatMemberType,
  getMemberOneTimeSubscriptions,
  getSubscriptionPayments,
  getSubscriptionRecurring,
}
