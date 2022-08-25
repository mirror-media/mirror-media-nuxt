import errors from '@twreporter/errors'
import { pageNames } from '~/serverMiddleware/appendUtmToUrl'

export const state = () => ({
  canAdvertise: true,
})

export const mutations = {
  setCanAdvertise(state, canAdvertise) {
    state.canAdvertise = canAdvertise
  },
}

export const actions = {
  async nuxtServerInit({ commit, dispatch, state }, { req, res, app }) {
    if (res && res.locals && res.locals.user) {
      const { allClaims: claims, idToken: token, ...authUser } = res.locals.user
      commit('membership/ON_AUTH_STATE_CHANGED_MUTATION', {
        authUser,
        claims,
        token,
      })

      await dispatch('membership-subscribe/FETCH_BASIC_INFO')
    }
    const sectionsResponse = await dispatch('fetchGlobalData')
    commitSectionsData(commit, sectionsResponse)
    commit(
      'membership-subscribe/getFeatureToggleStatus',
      app.$config.noAdFeatureToggle
    )
    commit(
      'membership/getFeatureToggleStatus',
      app.$config.emailVerifyFeatureToggle
    )
    if (
      req.method === 'GET' &&
      (req.path === '/' || pageNames.includes(req.path.split('/')[1]))
    ) {
      try {
        const utmObj = req.cookies.utm
          ? JSON.parse(req.cookies.utm)
          : res.locals.utm
        if (utmObj && !utmObj.terminated) {
          commit('utm-url-params/SET_UTM', utmObj)
        }
      } catch (error) {
        const annotatingError = errors.helpers.wrap(
          error,
          'vuex/index.js nuxtServerInit()',
          `Encounter error on parsing utm cookie ${req.cookies.utm}`
        )
        // eslint-disable-next-line no-console
        console.error(
          JSON.stringify({
            severity: 'ERROR',
            message: errors.helpers.printAll(annotatingError, {
              withStack: true,
              withPayload: true,
            }),
          })
        )
      }
    }
  },

  async fetchGlobalData({ dispatch }) {
    return await Promise.allSettled([
      dispatch('sections/fetchSectionsData'),
      dispatch('sections-member/fetchData'),
    ])
  },
}

function commitSectionsData(
  commit,
  [responseSectionsData = {}, responseSectionsDataMember = []] = []
) {
  commit(
    'sections/setSectionsData',
    responseSectionsData?.value?.endpoints?.sections ?? {}
  )
  commit('sections/addMagazineToMemberSection')

  commit('sections-member/setData', responseSectionsDataMember?.value ?? [])
}
