import { assign } from 'xstate'

export default {
  guards: {
    是否已登入: (context) => context.isLoggedIn,
    是否未同意服務條款: (context) => !context.isTosAgreed,
    是否未驗證信箱: (context) => !context.isEmailVerified,

    是單篇付款過的會員: (context) => context.subscription === '解鎖這篇報導',
    是月訂閱的會員: (context) => context.subscription === '月訂閱',
    是年訂閱的會員: (context) => context.subscription === '年訂閱',
    是訂閱但取消下期的會員: (context) =>
      context.subscription === '訂閱但取消下期',
    是marketing會員: (context) => context.subscription === 'marketing',

    是否已確認訂購方案: (context) => context.subscriptionOrder,
    訂購方案為單篇訂閱: (context) =>
      context.subscriptionOrder === '解鎖這篇報導',
    訂購方案為月訂閱: (context) => context.subscriptionOrder === '月訂閱',
    訂購方案為年訂閱: (context) => context.subscriptionOrder === '年訂閱',
    訂購方案為月訂閱升級年訂閱: (context) =>
      context.subscription === '月訂閱' &&
      context.subscriptionOrder === '年訂閱',

    是否從會員文章頁來的: (context) => context.isFromPost,

    訂購: (context) => context.redirectDestination === 'purchaseForm',
    方案: (context) => context.redirectDestination === 'sub',
  },
  actions: {
    login: assign({
      isLoggedIn: true,
      isEmailVerified: (context, event) => {
        return event?.userData?.firebase?.userEmailVerified ?? false
      },
      isTosAgreed: (context, event) => {
        return event?.userData?.israfel?.basicInfo?.tos ?? false
      },
    }),
    verifyEmail: assign({
      isEmailVerified: true,
    }),
    agreeTos: assign({
      isTosAgreed: true,
    }),
    orderSubscribe: assign({
      subscriptionOrder: (context, event) => {
        return event.type
      },
    }),
    subscribe: assign({
      subscription: (context) => {
        mockPostSubscription(context.subscriptionOrder)
        return context.subscriptionOrder
      },
      subscriptionOrder: null,
    }),
    cancelSubscribe: assign({
      subscription: () => {
        mockRemoveSubscription()
        return null
      },
    }),
    setFromPost: assign({
      isFromPost: true,
    }),
    setRedirectToForm: assign({
      redirectDestination: 'purchaseForm',
    }),
    setRedirectToSub: assign({
      redirectDestination: 'sub',
    }),
  },
}

function mockPostSubscription(subscription) {
  localStorage.setItem('subscription', subscription)
}

function mockRemoveSubscription() {
  localStorage.setItem('subscription', '訂閱但取消下期')
}
