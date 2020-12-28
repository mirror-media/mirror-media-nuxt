export const state = () => ({
  user: {},
  userUid: undefined,
  userEmail: undefined,
  userEmailVerified: undefined,
  userToken: undefined,
})

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION(state, { authUser, token }) {
    if (authUser) {
      const { uid, email, emailVerified } = authUser

      state.userUid = uid
      state.userEmail = email
      state.userEmailVerified = emailVerified
      if (token) {
        state.userToken = token
      }
    } else {
      state.userUid = undefined
      state.userEmail = undefined
      state.userEmailVerified = undefined
      state.userToken = undefined
    }
  },
}

export const getters = {
  isLoggedIn(state) {
    return !!state.userEmail
  },
}
