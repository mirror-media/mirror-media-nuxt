import { fetchMemberSubscriptions } from '~/apollo/queries/memberSubscription.gql'

async function fetchMemberSubscriptionType(vueComponent) {
  // determine whether user is logged in or not
  const firebaseId = getUserFirebaseId(vueComponent.$fire)

  if (!firebaseId) return 'not-member' // no user is logged in

  // get user's subscription state
  try {
    const result = await fireGqlRequest(
      fetchMemberSubscriptions,
      {
        firebaseId,
      },
      vueComponent.$apolloProvider
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
  const firebaseId = getUserFirebaseId(vueComponent.$fire)

  try {
    // get user's subscription state
    const result = await fireGqlRequest(
      fetchMemberSubscriptions,
      {
        firebaseId,
      },
      vueComponent.$apolloProvider
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
    console.log(error)
    return {}
  }
}

function getUserFirebaseId(fire) {
  const currentUser = fire.auth.currentUser

  return currentUser?.uid || null
}

async function fireGqlRequest(query, variables, apolloProvider) {
  const apollo = apolloProvider.clients.memberSubscription

  return await apollo.mutate({
    mutation: query,
    variables,
  })
}

export { fetchMemberSubscriptionType, fetchMemberSubscriptionList }
