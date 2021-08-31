import { fetchMemberSubscriptions } from '~/apollo/queries/memberSubscription.gql'

async function fetchMemberSubscriptionType(vueComponent) {
  // determine whether user is logged in or not
  const currentUser = vueComponent.$fire.auth.currentUser
  if (!currentUser) return 'not-member'

  // get user's firebaseId, then fetch it's subscription state
  const firebaseId = currentUser.uid

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

async function fireGqlRequest(query, variables, apolloProvider) {
  const apollo = apolloProvider.clients.memberSubscription

  return await apollo.mutate({
    mutation: query,
    variables,
  })
}

export { fetchMemberSubscriptionType }
