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
        createNavigation(router, route, '/member-subscribe')
      },
      navigateToSubscribeInfo() {
        createNavigation(router, route, '/member-subscribe/info')
      },
    },
  }).withContext({
    ...machine.context,
    isLoggedIn: store.getters['membership/isLoggedIn'],
  })
}

function createNavigation(router, route, path) {
  if (shouldStopNavigation(route, path)) {
    return
  }
  router.push(path)

  function shouldStopNavigation(route, path) {
    return isCurrentRoutePathMatching()

    function isCurrentRoutePathMatching() {
      return route.value.path.startsWith(path)
    }
  }
}
