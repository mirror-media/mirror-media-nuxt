import { assign, createMachine as createMachineXState } from 'xstate'
import machine from './config/machine'
import options from './config/options'
import { setMemberTosToTrue } from '~/apollo/queries/memberSubscription.gql'

export default function createMachine(router, route, store, apolloProvider) {
  return createMachineXState(machine, {
    guards: {
      ...options.guards,
    },
    actions: {
      ...options.actions,
      setFromPost: assign({
        isFromPost: route.value.fullPath,
      }),
      setUserEmailVerification: assign({
        isEmailVerified: !!store.state.membership.userEmailVerified,
      }),
      navigateToLoginPage() {
        createNavigation(
          router,
          route,
          `/login?destination=${route.value.fullPath}&ms=true`
        )
      },
      navigateToServiceRule() {
        createNavigation(router, route, '/service-rule?ms=true')
      },
      navigateToPremiumPage(context) {
        createNavigation(router, route, context.isFromPost)
      },
      navigateToSubscribePlans() {
        createNavigation(router, route, '/subscribe?ms=true')
      },
      navigateToSubscribeInfo() {
        createNavigation(router, route, '/subscribe/info?ms=true')
      },
      navigateToSubscribeSuccess() {
        createNavigation(router, route, '/subscribe/success?ms=true')
      },
      navigateToSubscribeFail() {
        createNavigation(router, route, '/subscribe/fail?ms=true')
      },
      navigateToSubscribeSet() {
        createNavigation(router, route, '/subscribe/set?ms=true')
      },
      navigateToSubscribeCancelAsk() {
        createNavigation(router, route, '/subscribe/cancel-ask?ms=true')
      },
      navigateToSubscribeCancelSuccess() {
        createNavigation(router, route, '/subscribe/cancel-success?ms=true')
      },
      navigateToSubscribeCancelFail() {
        createNavigation(router, route, '/subscribe/cancel-fail?ms=true')
      },
      navigateToProfilePurchase() {
        createNavigation(router, route, '/profile/purchase?ms=true')
      },
      navigateToEmailVerify() {
        createNavigation(router, route, '/email-verify?ms=true')
      },
      navigateToSectionMember() {
        window.location.assign('/section/member')
      },

      agreeTos: assign({
        isTosAgreed: async () => {
          const {
            data,
          } = await apolloProvider.clients.memberSubscription.mutate({
            mutation: setMemberTosToTrue,
            variables: {
              id: store.state['membership-subscribe'].basicInfo.id,
            },
          })
          const tos = data?.updateMember?.tos ?? false
          store.commit('membership-subscribe/SET_BASIC_INFO', { tos })
          return tos
        },
      }),
    },
  }).withContext({
    ...machine.context,
    isLoggedIn: store.getters['membership/isLoggedIn'],
    isTosAgreed: store.state['membership-subscribe'].basicInfo.tos,
    isEmailVerified: !!store.state.membership.userEmailVerified,
    subscription: mockFetchSubscription(),
  })
}

function createNavigation(router, route, path) {
  if (!path || shouldStopNavigation(route, path)) {
    return
  }
  router.replace(path)

  function shouldStopNavigation(route, path) {
    return isCurrentRoutePathMatching()

    function isCurrentRoutePathMatching() {
      return route.value.fullPath.startsWith(path)
    }
  }
}

function mockFetchSubscription() {
  return localStorage.getItem('subscription') ?? null
}
