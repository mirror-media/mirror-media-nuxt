import {
  fetchMemberSubscriptions,
  fetchMemberBasicInfo,
  setMemberTosToTrue,
} from '~/apollo/queries/memberSubscription.gql'

async function fetchMemberSubscriptionType(vueComponent) {
  // determine whether user is logged in or not
  const firebaseId = await getUserFirebaseId(vueComponent)
  if (!firebaseId) return 'not-member' // no user is logged in

  // get user's subscription state
  try {
    const result = await fireGqlRequest(
      fetchMemberSubscriptions,
      {
        firebaseId,
      },
      vueComponent
    )

    // handle gql error
    if (result.error) {
      console.log(result.error)
      return 'not-member'
    }

    // check member's latest subscription state
    const memberData = result?.data?.member
    const latestSubscription = getLatestSubscription(memberData)

    const subscriptionFrequency = latestSubscription.frequency

    switch (subscriptionFrequency) {
      case 'one_time':
        return 'basic'

      case 'monthly':
        return 'month'

      case 'yearly':
        return 'year'

      default:
        return 'basic'
    }
  } catch (error) {
    // handle network error
    console.log(error)

    return 'not-member'
  }
}

async function fetchMemberSubscriptionList(vueComponent) {
  const firebaseId = await getUserFirebaseId(vueComponent)
  if (!firebaseId) return null

  try {
    // get user's subscription state
    const result = await fireGqlRequest(
      fetchMemberSubscriptions,
      {
        firebaseId,
      },
      vueComponent
    )

    // handle gql error
    if (result.error) {
      console.log(result.error)
      return {}
    }

    // check member's latest subscription state
    const memberData = result?.data?.member
    return memberData
  } catch (error) {
    // handle network error
    console.log(error.message)

    return {}
  }
}

async function getUserFirebaseId(vueComponent) {
  const currentUserUid = await vueComponent.$store.state.membership.userUid

  return currentUserUid || null
}

async function fireGqlRequest(query, variables, vueComponent, firebaseToken) {
  if (firebaseToken) {
    console.log(firebaseToken)
  }

  const result = await vueComponent.$apolloProvider.clients.memberSubscription.mutate(
    {
      mutation: query,
      variables,
    }
  )

  return result
}

function getMemberPayRecords(memberData) {
  if (!memberData) return []

  const payRecords = []
  memberData.subscription.forEach((subscription) => {
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

function getMemberSubscribePosts(memberData) {
  if (!memberData) return []

  const postList = []
  memberData.subscription.forEach((subscription) => {
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
function getMemberShipStatus(memberData) {
  if (!memberData) return []

  const latestSubscription = getLatestSubscription(memberData)
  const status = latestSubscription.frequency

  const memberShipStatus = {
    name: status,
    dueDate: getFormatDate(latestSubscription.periodEndDatetime),
    nextPayDate: getFormatDate(latestSubscription.periodNextPayDatetime),
    payMethod: latestSubscription.paymentMethod,
  }

  return memberShipStatus
}

function isMemberPremium(memberShipStatus) {
  const status = memberShipStatus?.name
  return status === 'yearly' || status === 'monthly' || status === 'disturb'
}

async function fetchMemberServiceRuleStatus(vueComponent) {
  // determine whether user is logged in or not
  const firebaseId = await getUserFirebaseId(vueComponent)
  if (!firebaseId) return null

  // get user's subscription state
  try {
    const result = await fireGqlRequest(
      fetchMemberBasicInfo,
      {
        firebaseId,
      },
      vueComponent
    )

    // handle gql error
    if (result.error) {
      console.log(result.error)
      return false
    }

    // check member's tos
    const member = result?.data?.member
    return !!member.tos
  } catch (error) {
    // handle network error
    console.log(error)

    return false
  }
}

async function setMemberServiceRuleStatusToTrue(vueComponent) {
  // determine whether user is logged in or not
  const firebaseId = await getUserFirebaseId(vueComponent)
  if (!firebaseId) return null

  // get member's israfel ID
  const memberIsrafelId = await getMemberIsrafelId(vueComponent, firebaseId)
  // TODO： put member's israfelID to vuex

  const firebaseToken = getFirebaseToken(vueComponent)

  // fire mutation, set member's tos(service rule) to true
  try {
    const result = await fireGqlRequest(
      setMemberTosToTrue,
      {
        id: memberIsrafelId,
      },
      vueComponent,
      firebaseToken
    )

    // handle gql error
    if (result.error) {
      console.log(result.error)
    }

    // check member's tos
    const member = result?.data?.member
    return !!member.tos
  } catch (error) {
    // handle network error
    console.log(error)
  }
}

async function getMemberIsrafelId(vueComponent, firebaseId) {
  // TODO： put member's israfelID to vuex
  const result = await fireGqlRequest(
    fetchMemberBasicInfo,
    {
      firebaseId,
    },
    vueComponent
  )
  const memberIsrafelId = result?.data?.member?.id
  return memberIsrafelId
}

function getFirebaseToken(vueComponent) {
  return vueComponent.$store.state?.membership?.userToken
}

function getLatestSubscription(memberData) {
  return memberData?.subscription[0]
}

export {
  fetchMemberSubscriptionType,
  fetchMemberSubscriptionList,
  getMemberPayRecords,
  getMemberSubscribePosts,
  getMemberShipStatus,
  isMemberPremium,
  fetchMemberServiceRuleStatus,
  setMemberServiceRuleStatusToTrue,
}
