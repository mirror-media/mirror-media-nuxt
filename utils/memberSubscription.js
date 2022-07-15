import { print } from 'graphql/language/printer'
import axios from 'axios'
import moment from 'moment'
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
  setSubscriptionFromMonthToYear,
} from '~/apollo/mutations/memberSubscriptionMutation.gql'

import { API_PATH_FRONTEND } from '~/configs/config.js'

const baseUrl = process.browser
  ? `${location.origin}/`
  : 'http://localhost:3000/'
const apiUrl = `${baseUrl}${API_PATH_FRONTEND}/member-subscription/v0`
const k3ApiUrl = `${baseUrl}${API_PATH_FRONTEND}/getposts`

async function getMemberType(context) {
  // determine whether user is logged in or not
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return 'not-member' // no user is logged in

  try {
    const res = await fireGqlRequest(
      fetchMemberBasicInfo,
      { firebaseId },
      context
    )
    const memberBasicInfo = res.data?.allMembers?.[0]
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
      return 'subscribe_one_time'

    case 'subscribe_monthly':
    case 'monthly':
      return 'subscribe_monthly'

    case 'subscribe_yearly':
    case 'yearly':
      return 'subscribe_yearly'

    case 'marketing':
      return 'marketing'
    case 'none':
    default:
      return 'none'
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

  // change subscription.isCanceled to true (carry unsubscribe reason)
  await fireGqlRequest(
    unsubscribe,
    {
      id: subscription[0].id,
      note: reason,
    },
    context
  )
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
  try {
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
        'Cache-Control': 'no-store',
      },
    })

    if (result.errors) {
      throw new Error(result.errors[0].message)
    }

    return result
  } catch (error) {
    throw new Error(error.message)
  }
}

function getMemberPayRecords(subscriptionList) {
  if (!subscriptionList?.length) return []

  const payRecords = []

  subscriptionList.forEach((subscription) => {
    subscription.newebpayPayment?.forEach((newebpayPayment) => {
      const payRecord = {
        number: subscription.orderNumber,
        date: getFormatDateWording(newebpayPayment.paymentTime),
        type: getSubscriptionTypeWording(subscription.frequency),
        method: newebpayPayment.paymentMethod,
        methodNote: `(${newebpayPayment.cardInfoLastFour || ''})`,
        price: newebpayPayment.amount,
        status: newebpayPayment.status,
        createAt: newebpayPayment.createdAt,
      }
      payRecords.push(payRecord)
    })
    subscription.googlePlayPayment?.forEach((payment) => {
      const payRecord = {
        number: subscription.orderNumber,
        date: getFormatDateWording(payment.transactionDatetime),
        type: '',
        method: 'Google Play 續扣',
        methodNote: '',
        price: payment.amount,
        status: '',
        createAt: payment.createdAt ?? payment.transactionDatetime,
      }
      payRecords.push(payRecord)
    })
  })

  // sort all records by date_dsc
  payRecords.sort((recordA, recordB) => {
    return new Date(recordB.createAt) - new Date(recordA.createAt)
  })

  return payRecords
}

function getSubscriptionTypeWording(type) {
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

function getFormatDateWording(dateString) {
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
    const member = result?.data?.allMembers?.[0]
    return !!member.tos
  } catch (error) {
    console.error(error)
    return false
  }
}

async function setMemberServiceRuleStatusToTrue(context) {
  // determine whether user is logged in or not
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return

  // get member's israfel ID
  const memberIsrafelId = await getMemberIsrafelId(firebaseId, context)

  // TODO： put member's israfelID to vuex

  // fire mutation, set member's tos(service rule) to true

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
  const memberIsrafelId = result?.data?.allMembers?.[0]?.id
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
    const subscriptions = await getMemberAllSubscriptions(firebaseId, context)
    return isSubscriptionPayByMobileAppStore(subscriptions)
  } catch (error) {
    console.error(error)
    return false
  }
}

function isSubscriptionPayByMobileAppStore(subscriptions = []) {
  if (!subscriptions.length) return false
  const appSubscribeRecord = subscriptions.find(
    (subscription) =>
      subscription.isActive &&
      (subscription.paymentMethod === 'app_store' ||
        subscription.paymentMethod === 'google_play')
  )

  return !!appSubscribeRecord
}

async function getPaymentDataOfSubscription(context, gateWayPayload) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  const { frequency } = gateWayPayload
  const isRecurringPurchase = frequency === 'yearly' || frequency === 'monthly'
  let query

  if (isRecurringPurchase) {
    query = fetchPaymentDataOfSubscriptionRecurring
  } else {
    query = fetchPaymentDataOfSubscriptionOneTime
  }

  const { data } = await fireGqlRequest(query, gateWayPayload, context)

  if (isRecurringPurchase) {
    return data.createSubscriptionRecurring?.newebpayPayload
  } else {
    return data.createsSubscriptionOneTime?.newebpayPayload
  }
}

async function getMemberOneTimeSubscriptions(context, loadmoreConfig) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

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
}

async function getMemberSubscribePosts(subscriptionList) {
  if (!subscriptionList?.length) return []
  const postList = []

  // get subscription-ontime's id array
  const postIdList = subscriptionList.map((subscription) => {
    return subscription.postId
  })

  const whereObjForSearch = {
    where: {
      _id: {
        $in: postIdList,
      },
    },
  }

  // fetch post's info via post id
  const {
    data: { _items },
  } = await axios.get(k3ApiUrl, { params: whereObjForSearch })

  // put post title/url into postList
  subscriptionList.forEach((subscription, index) => {
    const correspondPost = _items.find((post) => {
      return post._id === subscription.postId
    })

    const post = {
      id: getUniquePostId(subscription.postId, subscription.oneTimeEndDatetime),
      title: correspondPost.title,
      url: `/story/${correspondPost.slug}`,
      deadline: getFormatDateWording(subscription.oneTimeEndDatetime),
    }
    postList.push(post)
  })
  return postList
}

function getUniquePostId(postId, endDateTime) {
  return `${postId}-${moment(endDateTime).format('YYYYMMDDHHmmss')}`
}

async function getMemberShipStatus(context, memberShipStatusName) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  if (memberShipStatusName === 'subscribe_one_time') {
    return {
      name: 'subscribe_one_time',
      dueDate: null,
      nextPayDate: null,
      payMethod: null,
    }
  }

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

  // destructure subscription and format it
  const {
    frequency,
    nextFrequency,
    periodEndDatetime,
    periodNextPayDatetime,
    newebpayPayment,
    isCanceled,
    paymentMethod,
  } = subscription[0]
  const { cardInfoLastFour } = newebpayPayment?.[0] || {
    cardInfoLastFour: null,
  }

  const payMethodText = generatePayMethodText(paymentMethod, cardInfoLastFour)

  if (isCanceled && frequency === 'yearly') {
    return {
      name: 'subscribe_yearly_disturb',
      dueDate: `至 ${getFormatDateWording(periodEndDatetime)}`,
      nextPayDate: null,
      payMethod: null,
    }
  } else if (isCanceled && frequency === 'monthly') {
    return {
      name: 'subscribe_monthly_disturb',
      dueDate: `至 ${getFormatDateWording(periodEndDatetime)}`,
      nextPayDate: null,
      payMethod: null,
    }
  } else {
    return {
      name: generateMemberShipStatusName(),
      dueDate: `至 ${getFormatDateWording(periodEndDatetime)}`,
      nextPayDate: getFormatDateWording(periodNextPayDatetime),
      payMethod: payMethodText,
    }
  }

  function generatePayMethodText(paymentMethod = '', cardInfoLastFour = '') {
    const paymentMethodText =
      paymentMethod && cardInfoLastFour
        ? `${paymentMethod}(${cardInfoLastFour})`
        : ''
    switch (paymentMethod) {
      case 'app_store':
        return 'Apple Pay'
      case 'google_play':
        return 'Google Store'
      case 'newebpay':
        return paymentMethodText
      default:
        return paymentMethodText
    }
  }

  function generateMemberShipStatusName() {
    if (frequency === 'monthly' && nextFrequency === 'yearly') {
      return 'subscribe_monthly_update_to_yearly'
    } else if (frequency === 'yearly' && nextFrequency === 'monthly') {
      return 'subscribe_yearly_update_to_monthly'
    } else return memberShipStatusName
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

async function getPremiumMemberSubscriptionInfo(context) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

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
  return subscription[0]
}

async function updateSubscriptionFromMonthToYear(context, subscriptionId) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  // get user's subscription state
  return await fireGqlRequest(
    setSubscriptionFromMonthToYear,
    {
      id: subscriptionId,
    },
    context
  )
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
  getMemberShipStatus,
  getPremiumMemberSubscriptionInfo,
  updateSubscriptionFromMonthToYear,
}
