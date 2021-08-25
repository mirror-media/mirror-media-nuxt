import { assign, createMachine as createMachineXState } from 'xstate'
import machine from './config/machine'
import options from './config/options'

export default function createMachine(router, route, store) {
  return createMachineXState(machine, {
    guards: {
      ...options.guards,
    },
    actions: {
      ...options.actions,
      setFromPost: assign({
        isFromPost: route.value.fullPath,
      }),
      navigateToLoginPage() {
        createNavigation(
          router,
          route,
          `/login?destination=${route.value.fullPath}&ms=true`
        )
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
      navigateToSectionMember() {
        window.location.assign('/section/member')
      },
    },
  }).withContext({
    ...machine.context,
    isLoggedIn: store.getters['membership/isLoggedIn'],
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
