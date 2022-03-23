// /* eslint-disable */
// import { State } from 'xstate'
// import { useInterpret, useMachine } from 'xstate-vue2'
// import { onBeforeMount, useContext, useRouter, provide, ref } from '@nuxtjs/composition-api'
// import { ENV } from '~/configs/config'
// import machine from '~/xstate/member-subscribe/machine'
//
//
// export function useMachineMemberSubscribe() {
//   const { store, route } = useContext()
//   const router = useRouter()
//   // const persistedState = getResolvedState()
//   // sessionStorage.removeItem('app-state')
//   return useInterpret(machine, {
//     devTools: ENV === 'local' || ENV === 'dev',
//     // state: persistedState,
//     context: {
//       isLoggedIn: store.getters['membership/isLoggedIn']
//     },
//     actions: {
//       navigateToLoginPage() {
//         createNavigation(router, route, '/login')
//       }
//     }
//   })
// }
//
// export function useInitialStateMachineMemberSubscribe() {
//   if (process.server) {
//     return {}
//   }
//
//   const { route } = useContext()
//   if (!isMemberSubscribeFeatureToggled(route)) {
//     return
//   }
//
//   {
//     const service = useMachineMemberSubscribe()
//     provide('serviceMembershipSubscribe', service)
//     // service.onTransition(handleTransition)
//     if (route.value.name === 'premium-slug') {
//       service.send('到會員文章頁')
//     }
//
//     return { service }
//   }
// }
//
//
// export function isMemberSubscribeFeatureToggled(route) {
//   return Boolean(route.value.query.ms)
// }
//
// function createNavigation(router, route, path) {
//   if (shouldStopNavigation(route, path)) {
//     return
//   }
//   router.push(`${path}`)
//
//   function shouldStopNavigation(route, path) {
//     return isCurrentRoutePathMatching()
//
//     function isCurrentRoutePathMatching() {
//       return route.value.path.startsWith(path)
//     }
//   }
// }
//
// function handleTransition(currentState) {
//   const jsonState = JSON.stringify(currentState)
//
//   // Example: persisting to sessionStorage
//   try {
//     sessionStorage.setItem('app-state', jsonState)
//   } catch (e) {
//     // unable to save to sessionStorage
//   }
// }
//
// function getResolvedState() {
//   return JSON.parse(sessionStorage.getItem('app-state'))
// }

import { useService } from 'xstate-vue2'
import { ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { interpret } from 'xstate'
import createMachine from '~/xstate/member-subscribe/machine'
import {
  createResolvedState,
  isMemberSubscribeFeatureToggled,
} from '~/xstate/member-subscribe/util'

const service = ref()

export function useMemberSubscribeMachine() {
  const { route } = useContext()
  if (
    process.env.NODE_ENV === 'test' || // disable the feature in Jest environment
    !isMemberSubscribeFeatureToggled(route) ||
    process.server
  ) {
    // mock object of bypass everything
    return {
      state: ref(new Proxy({}, { get: () => () => {} })),
      send: () => {},
    }
  }

  if (!service.value) {
    const { store, app } = useContext()
    const router = useRouter()
    const machine = createMachine(router, route, store, app.apolloProvider)
    const resolvedState = createResolvedState(machine)
    service.value = interpret(machine, {
      devTools: true,
    }).start(resolvedState)
    if (route.value.name === 'premium-slug') {
      service.value.send('到會員文章頁')
    }
    if (route.value.name === 'subscribe') {
      service.value.send('到方案購買頁')
    }
    if (route.value.name === 'profile-purchase') {
      service.value.send('到付款紀錄頁')
    }
    if (route.value.name === 'subscribe-set') {
      service.value.send('到付款設定頁')
    }
    if (route.value.name === 'subscribe-cancel-ask') {
      service.value.send('到取消訂閱（原因詢問）頁')
    }
  }
  return useService(service.value)
}
