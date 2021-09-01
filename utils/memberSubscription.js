import { fetchMemberSubscriptions } from '~/apollo/queries/memberSubscription.gql'

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
    const member = result?.data?.member
    const latestSubscription = member.subscription[0]
    const subscriptionFrequency = latestSubscription.frequency

    switch (subscriptionFrequency) {
      case 'one_time':
        return 'basic'

      case 'monthy':
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
  const currentUser = await vueComponent.$fire.auth.currentUser
  return currentUser?.uid || null
}

async function fireGqlRequest(query, variables, vueComponent) {
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
  const month = ('0' + date.getMonth()).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)

  return `${year}/${month}/${day}`
}

export {
  fetchMemberSubscriptionType,
  fetchMemberSubscriptionList,
  getMemberPayRecords,
}
