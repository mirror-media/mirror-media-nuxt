import { print } from 'graphql/language/printer'
import axios from 'axios'
import _ from 'lodash'
import {
  API_PATH_FRONTEND,
  WEEKLY_API_SERVER_ORIGIN,
} from '~/configs/config.js'
import { PaymentMethod, MemberType, Frequency } from '~/constants/common'

import {
  fetchMemberSubscriptions,
  fetchMemberBasicInfo,
  fetchOneTimeSubscriptions,
  fetchSubscriptionPayments,
  fetchRecurringSubscription,
  fetchOneTimeSubscriptionsWithLINEPay,
  fetchSubscriptionPaymentsWithLINEPay,
} from '~/apollo/queries/memberSubscriptionQuery.gql'
import {
  setMemberTosToTrue,
  unsubscribe,
  fetchPaymentDataOfSubscriptionRecurring,
  fetchPaymentDataOfSubscriptionOneTime,
  setSubscriptionFromMonthToYear,
  setSubscriptionNote,
} from '~/apollo/mutations/memberSubscriptionMutation.gql'
import { postOnlyId } from '~/apollo/queries/postsInKeystone6.gql'
const baseUrl = process.browser
  ? `${location.origin}/`
  : 'http://localhost:3000/'
const apiUrl = `${baseUrl}${API_PATH_FRONTEND}/member-subscription/v0`
const newApiUrl = `${baseUrl}${API_PATH_FRONTEND}/member-subscription/v2`
const k3ApiUrl = `${baseUrl}${API_PATH_FRONTEND}/getposts`

const weeklyApiServerUrl = `https://${WEEKLY_API_SERVER_ORIGIN}/content/graphql`
function getUserFirebaseId(context) {
  const currentUserUid = context.store?.state?.membership?.userUid

  return currentUserUid || null
}

function getFirebaseToken(context) {
  return context.store?.state?.membership?.userToken
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

async function fireGqlRequestNewApi(query, variables, context) {
  const firebaseToken = getFirebaseToken(context)
  const { data: result } = await axios({
    url: newApiUrl,
    method: 'post',
    data: {
      query: print(query),
      variables,
    },
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${firebaseToken}`,
      'Cache-Control': 'no-cache',
    },
  })

  if (result.errors) {
    throw new Error(result.errors[0].message)
  }

  return result
}

async function getMemberType(context) {
  // determine whether user is logged in or not
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return 'not-member' // no user is logged in

  try {
    if (context.$config.linepayUiToggle) {
      const res = await fireGqlRequestNewApi(
        fetchMemberBasicInfo,
        { firebaseId },
        context
      )
      const memberBasicInfo = res.data?.allMembers?.[0]
      return formatMemberType(memberBasicInfo.type)
    }

    // TODO: remove following lines when LINE Pay feature is stable in production
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
    case MemberType.OneTime:
    case Frequency.OneTime:
      return MemberType.OneTime

    case MemberType.Monthly:
    case Frequency.Monthly:
      return MemberType.Monthly

    case MemberType.Yearly:
    case Frequency.Yearly:
      return MemberType.Yearly

    case MemberType.Marketing:
      return MemberType.Marketing
    case MemberType.None:
    default:
      return MemberType.None
  }
}

// TODO: might not in use, should be removed
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

  if (context.$config.linepayUiToggle) {
    // get user's subscription state
    const {
      data: {
        member: { subscription },
      },
    } = await fireGqlRequestNewApi(
      fetchRecurringSubscription,
      {
        firebaseId,
      },
      context
    )

    // change subscription.isCanceled to true (carry unsubscribe reason)
    await fireGqlRequestNewApi(
      unsubscribe,
      {
        id: subscription[0].id,
        note: reason,
      },
      context
    )

    return
  }

  // TODO: remove following lines when LINE Pay feature is stable in production

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
    if (context.$config.linepayUiToggle) {
      const result = await fireGqlRequestNewApi(
        fetchMemberSubscriptions,
        {
          firebaseId,
        },
        context
      )

      // get member's all subscriptions
      const subscriptions = result?.data?.member?.subscription

      return subscriptions || []
    }

    // TODO: remove following lines when LINE Pay feature is stable in production
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

function getMemberPayRecords(subscriptionList) {
  if (!subscriptionList?.length) return []

  const payRecords = []
  const LINEPayStatusMap = {
    paid: 'SUCCESS',
    fail: 'FAIL',
  }

  subscriptionList.forEach((subscription) => {
    subscription.newebpayPayment?.forEach((newebpayPayment) => {
      const payRecord = {
        number: subscription.orderNumber,
        date: getFormatDateWording(
          newebpayPayment.createdAt ?? newebpayPayment.paymentTime
        ),
        type: getSubscriptionTypeWording(subscription.frequency),
        method: newebpayPayment.paymentMethod,
        methodNote: `(${newebpayPayment.cardInfoLastFour || ''})`,
        price: newebpayPayment.amount,
        status: newebpayPayment.status,
        createdAt: newebpayPayment.createdAt,
      }
      payRecords.push(payRecord)
    })
    subscription.linepayPayment?.forEach((linepayPayment) => {
      const payRecord = {
        number: subscription.orderNumber,
        date: getFormatDateWording(
          linepayPayment.createdAt ?? linepayPayment.transactionTime
        ),
        type: getSubscriptionTypeWording(subscription.frequency),
        method: 'LINE Pay',
        methodNote: '',
        price: linepayPayment.amount,
        status: LINEPayStatusMap[subscription.linePayStatus] ?? '',
        createdAt: linepayPayment.createdAt ?? linepayPayment.transactionTime,
      }
      payRecords.push(payRecord)
    })
    subscription.googlePlayPayment?.forEach((payment) => {
      const payRecord = {
        number: subscription.orderNumber,
        date: getFormatDateWording(
          payment.createdAt ?? payment.transactionDatetime
        ),
        type: '',
        method: 'Google Play 續扣',
        methodNote: '',
        price: payment.amount,
        status: '',
        createdAt: payment.createdAt ?? payment.transactionDatetime,
      }
      payRecords.push(payRecord)
    })
  })

  // sort all records by date_dsc
  payRecords.sort((recordA, recordB) => {
    return new Date(recordB.createdAt) - new Date(recordA.createdAt)
  })

  return payRecords
}

function getSubscriptionTypeWording(type) {
  switch (type) {
    case Frequency.Yearly:
      return '年訂閱'
    case Frequency.Monthly:
      return '月訂閱'
    case Frequency.OneTime:
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

// TODO: might not in use, should be removed
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

  if (context.$config.linepayUiToggle) {
    const result = await fireGqlRequestNewApi(
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

  // TODO: remove following lines when LINE Pay feature is stable in production
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

  if (context.$config.linepayUiToggle) {
    const result = await fireGqlRequestNewApi(
      fetchMemberBasicInfo,
      {
        firebaseId,
      },
      context
    )
    const memberIsrafelId = result?.data?.allMembers?.[0]?.id
    return memberIsrafelId
  }

  // TODO: remove following lines when LINE Pay feature is stable in production
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
      (subscription.paymentMethod === PaymentMethod.AppStore ||
        subscription.paymentMethod === PaymentMethod.GooglePay)
  )

  return !!appSubscribeRecord
}

async function getPaymentDataOfSubscription(context, gateWayPayload) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  const { frequency } = gateWayPayload
  const isRecurringPurchase = [Frequency.Monthly, Frequency.Yearly].includes(
    frequency
  )
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
  let result
  if (context.$config.linepayUiToggle) {
    result = await fireGqlRequestNewApi(
      fetchOneTimeSubscriptionsWithLINEPay,
      {
        firebaseId,
      },
      context
    )
  } else {
    // TODO: remove this section when LINE Pay feature is stable in production
    result = await fireGqlRequest(
      fetchOneTimeSubscriptions,
      {
        firebaseId,
      },
      context
    )
  }

  // get member's all subscriptions
  const subscriptions = result?.data?.member?.subscription
  const subscriptionsK3Id = subscriptions?.filter(
    (item) => item?.postId?.length === 24
  )

  return getMemberSubscribePosts(subscriptionsK3Id)
}

async function getMemberOneTimeSubscriptionsK6(context) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  // get user's subscription state
  let result
  if (context.$config.linepayUiToggle) {
    result = await fireGqlRequestNewApi(
      fetchOneTimeSubscriptionsWithLINEPay,
      {
        firebaseId,
      },
      context
    )
  } else {
    // TODO: remove this section when LINE Pay feature is stable in production
    result = await fireGqlRequest(
      fetchOneTimeSubscriptions,
      {
        firebaseId,
      },
      context
    )
  }

  // get member's all subscriptions
  const subscriptions = result?.data?.member?.subscription
  const subscriptionsK6Id = subscriptions?.filter(
    (item) => item?.postId?.length !== 24
  )

  return getMemberSubscribePostsK6(subscriptionsK6Id)
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
      id: subscription.postId,
      title: correspondPost.title,
      url: `/story/${correspondPost.slug}`,
      deadline: getFormatDateWording(subscription.oneTimeEndDatetime),
    }
    postList.push(post)
  })

  // return newest unique posts
  return _.uniqBy(postList, 'id')
}

async function getMemberSubscribePostsK6(subscriptionList) {
  if (!subscriptionList?.length) return []
  const postList = []

  // get subscription-ontime's id array
  const postIdList = subscriptionList.map((subscription) => {
    return subscription.postId
  })

  // fetch post's info via post id from keystone 6
  const {
    data: {
      data: { posts },
    },
  } = await axios({
    url: weeklyApiServerUrl,
    method: 'post',
    data: {
      query: print(postOnlyId),
      variables: { id: [...postIdList] },
    },
    headers: {
      'content-type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })

  // put post title/url into postList
  subscriptionList.forEach((subscription, index) => {
    const correspondPost = posts.find((post) => {
      return post.id === subscription.postId
    })

    const post = {
      id: subscription.postId,
      title: correspondPost.title,
      url: `/story/${correspondPost.slug}`,
      deadline: getFormatDateWording(subscription.oneTimeEndDatetime),
    }
    postList.push(post)
  })

  // return newest unique posts
  return _.uniqBy(postList, 'id')
}

async function getMemberShipStatus(context, memberShipStatusName) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  if (memberShipStatusName === MemberType.OneTime) {
    return {
      name: MemberType.OneTime,
      dueDate: null,
      nextPayDate: null,
      payMethod: null,
    }
  }

  // get user's subscription state
  let subscription
  if (context.$config.linepayUiToggle) {
    const {
      data: {
        member: { subscription: s },
      },
    } = await fireGqlRequestNewApi(
      fetchRecurringSubscription,
      {
        firebaseId,
      },
      context
    )
    subscription = s
  } else {
    // TODO: remove this section when LINE Pay feature is stable in production
    const {
      data: {
        member: { subscription: s },
      },
    } = await fireGqlRequest(
      fetchRecurringSubscription,
      {
        firebaseId,
      },
      context
    )
    subscription = s
  }

  // destructure subscription and format it
  const {
    frequency,
    nextFrequency,
    periodEndDatetime,
    periodNextPayDatetime,
    newebpayPayment,
    linepayPayment,
    isCanceled,
    paymentMethod,
  } = subscription[0]
  const { cardInfoLastFour } = newebpayPayment?.[0] || {
    cardInfoLastFour: '',
  }
  const { maskedCreditCardNumber } = linepayPayment?.[0] || {
    maskedCreditCardNumber: null,
  }
  const lastFourDigit =
    paymentMethod === PaymentMethod.NewebPay
      ? cardInfoLastFour
      : paymentMethod === PaymentMethod.LINEPay
      ? (maskedCreditCardNumber ?? '').slice(-4)
      : ''

  const payMethodText = generatePayMethodText(paymentMethod, lastFourDigit)

  if (isCanceled && frequency === Frequency.Yearly) {
    return {
      name: MemberType.YearlyDisturbed,
      dueDate: `至 ${getFormatDateWording(periodEndDatetime)}`,
      nextPayDate: null,
      payMethod: payMethodText,
    }
  } else if (isCanceled && frequency === Frequency.Monthly) {
    return {
      name: MemberType.MonthlyDisturbed,
      dueDate: `至 ${getFormatDateWording(periodEndDatetime)}`,
      nextPayDate: null,
      payMethod: payMethodText,
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
      case PaymentMethod.AppStore:
        return 'Apple Pay'
      case PaymentMethod.GooglePay:
        return 'Google Store'
      case PaymentMethod.LINEPay:
        return 'LINE Pay'
      case PaymentMethod.NewebPay:
        return paymentMethodText
      default:
        return paymentMethodText
    }
  }

  function generateMemberShipStatusName() {
    if (frequency === Frequency.Monthly && nextFrequency === Frequency.Yearly) {
      return MemberType.MonthlyToYearly
    } else if (
      frequency === Frequency.Yearly &&
      nextFrequency === Frequency.Monthly
    ) {
      return MemberType.YearlyToMonthly
    } else return memberShipStatusName
  }
}
async function getSubscriptionPayments(context, loadmoreConfig) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  try {
    // get user's subscription state
    let result
    if (context.$config.linepayUiToggle) {
      result = await fireGqlRequestNewApi(
        fetchSubscriptionPaymentsWithLINEPay,
        {
          firebaseId,
        },
        context
      )
    } else {
      // TODO: remove this section when LINE Pay feature is stable in production
      result = await fireGqlRequest(
        fetchSubscriptionPayments,
        {
          firebaseId,
        },
        context
      )
    }

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
  if (context.$config.linepayUiToggle) {
    const {
      data: {
        member: { subscription },
      },
    } = await fireGqlRequestNewApi(
      fetchRecurringSubscription,
      {
        firebaseId,
      },
      context
    )
    return subscription[0]
  }

  // TODO: remove following lines when LINE Pay feature is stable in production
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

  const changeDate = new Date().toISOString()

  // get user's subscription state
  if (context.$config.linepayUiToggle) {
    return await fireGqlRequestNewApi(
      setSubscriptionFromMonthToYear,
      {
        id: subscriptionId,
        changeDate,
      },
      context
    )
  }

  // TODO: remove following lines when LINE Pay feature is stable in production
  return await fireGqlRequest(
    setSubscriptionFromMonthToYear,
    {
      id: subscriptionId,
      changeDate,
    },
    context
  )
}

async function updateSubscriptionNote(context, subscriptionId, note) {
  const firebaseId = await getUserFirebaseId(context)
  if (!firebaseId) return null

  return await fireGqlRequestNewApi(
    setSubscriptionNote,
    {
      id: subscriptionId,
      note,
    },
    context
  )
}

export {
  getUserFirebaseId,
  getFirebaseToken,
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
  getMemberOneTimeSubscriptionsK6,
  getSubscriptionPayments,
  getMemberShipStatus,
  getPremiumMemberSubscriptionInfo,
  updateSubscriptionFromMonthToYear,
  updateSubscriptionNote,
}
