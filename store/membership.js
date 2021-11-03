import { createMemberProfile } from '~/apollo/mutations/userCreate.gql'

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
      } else {
        state.userSignInInfo = {}
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
  /*
   * this action triggered everytime when auth state has changed
   */
  async ON_AUTH_STATE_CHANGED_ACTION(
    { commit, dispatch, rootState },
    { authUser }
  ) {
    // because login has it's own fetch action, so disable it in here
    const isInLoginPage = this.app?.context?.route?.path === '/login'
    if (isInLoginPage) return

    try {
      // step 1: put authUser into Vuex
      await dispatch('SET_AUTH_STATE_TO_VUEX', { authUser })

      const hasMemberAuthDataInVuex = rootState.membership.userUid

      if (hasMemberAuthDataInVuex) {
        // step 2: fetch it data from israfel, them put it into Vuex
        await dispatch('membership-subscribe/FETCH_BASIC_INFO', null, {
          root: true,
        })
      }
    } catch (error) {
      // this.$fire.auth.signOut()
      console.error(error)
    }
  },
  async SET_AUTH_STATE_TO_VUEX({ commit }, { authUser }) {
    const token = authUser && (await authUser.getIdToken())
    commit('ON_AUTH_STATE_CHANGED_MUTATION', { authUser, token })
  },
  async LOGIN_PAGE_ON_AUTH_STATE_CHANGED_ACTION(
    { dispatch, rootState },
    { authUser, mode = 'login', isNewUser = false }
  ) {
    const isNotInLoginPage = this.app?.context?.route?.name !== 'login'
    if (isNotInLoginPage) return

    try {
      // step 1: put authUser into Vuex
      await dispatch('SET_AUTH_STATE_TO_VUEX', { authUser })

      // step 2: if it is a new user(register or first login by 3 party login), create it member is israfel
      if (mode === 'register' || isNewUser) {
        // create member in israfel
        await createMemberDataInIsrafel.bind(this)()
      }

      // step 3: fetch its data from israfel, them put it into Vuex
      const hasMemberAuthDataInVuex = rootState.membership.userUid
      if (hasMemberAuthDataInVuex) {
        // fetch member's basic info in Israfel
        await dispatch('membership-subscribe/FETCH_BASIC_INFO', null, {
          root: true,
        })
      }

      return {
        state: 'success',
      }
    } catch (error) {
      /*
       * there are 3 error situation:
       * 1: has firebase auth, but no member data in Israfel(login)
       * 2: has created new firebase auth, but member email is duplicated (regiser)
       * 3: some server error
       * in situation 1 and 2:
       * we need to delete this member's firebase account
       * in situation3:
       * do nothing with the firebase auth object
       */

      if (
        error.message ===
          "GraphQL error: Can't find data in Israfel, please check if this member's data existed in Israfel" ||
        error.message === "this member's email has been used in Israfel"
      ) {
        const currentUser = this.$fire.auth.currentUser

        currentUser?.delete()
      }

      // clear Vuex's authState
      await dispatch('SET_AUTH_STATE_TO_VUEX', { authUser: null })
      return {
        state: 'fail',
        error,
      }
    }

    async function createMemberDataInIsrafel() {
      const { email, uid } = authUser

      // if facebook authUser has no email,then feed email field with prompt
      let feededEmail = email
      if (!email) {
        feededEmail = `[0x001] - firebaseId:${uid}`
      }
      if (uid) {
        try {
          return await this.app.apolloProvider.clients.memberSubscription.mutate(
            {
              mutation: createMemberProfile,
              variables: {
                email: feededEmail,
              },
            }
          )
        } catch (error) {
          const message =
            error.message.search('Unique constraint failed') !== -1
              ? "this member's email has been used in Israfel"
              : error.message

          throw new Error(message)
        }
      }
    }
  },
}

export const getters = {
  isLoggedIn(state) {
    return !!state.userUid
  },
}
