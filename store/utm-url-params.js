import { objectToQueryString } from '~/utils/cookieQueryStringConverter'

export const state = () => ({
  utmObject: {},
})

export const mutations = {
  SET_UTM(state, utmObject) {
    state.utmObject = utmObject
  },
}

export const getters = {
  // can merge other url params in object format
  getUtmQueryString:
    ({ utmObject }) =>
    (otherObject) => {
      const parsedUtmObject = JSON.parse(JSON.stringify(utmObject)) || {}
      return objectToQueryString({
        ...otherObject,
        ...parsedUtmObject,
      })
    },
}
