export const state = () => ({
  user: {},
  userUid: undefined,
  userEmail: undefined,
  userEmailVerified: undefined,
  userToken: undefined,
  userSignInInfo: {},
})

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION(
    state,
    { authUser = {}, token, claims = {} } = {}
  ) {
    if (authUser) {
      const { uid, email, emailVerified } = authUser

      state.userUid = uid
      state.userEmail = email
      state.userEmailVerified = emailVerified

      if (Object.keys(claims).length !== 0) {
        const { firebase } = claims
        state.userSignInInfo = firebase
      }

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

export const actions = {
  async ON_AUTH_STATE_CHANGED_ACTION({ commit, dispatch }, { authUser }) {
    const token = authUser && (await authUser.getIdToken())
    commit('ON_AUTH_STATE_CHANGED_MUTATION', { authUser, token })

    await dispatch('membership-subscribe/FETCH_BASIC_INFO', null, {
      root: true,
    })
  },
}

export const getters = {
  isLoggedIn(state) {
    return !!state.userUid
  },
}
