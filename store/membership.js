export const state = () => ({
  user: {},
})

export const mutations = {
  /*
   * this mutation will be commit by @nuxtjs/firebase automatically
   * which is setting in service.auth.initialize.onAuthStateChangedMutation of nuxt.confij.js
   * for more info: https://firebase.nuxtjs.org/service-options/auth#onauthstatechangedmutation
   */
  ON_AUTH_STATE_CHANGED_MUTATION(state, { authUser }) {
    if (authUser) {
      const { uid, email, emailVerified } = authUser
      state.user = { uid, email, emailVerified }
    }
  },
}

export const getters = {
  isLoggedIn(state) {
    return state.user.email
  },
}
