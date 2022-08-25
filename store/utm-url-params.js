import {
  objectToQueryString,
  queryStringToObject,
} from '~/utils/cookieQueryStringConverter'

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

      /*
       * When otherObject contains url as url params value and the url holds the same utm
       * params, there will be duplicate url params after one conversion from merged object
       * to query string.
       * So we convert it again back to object to eliminate the possible
       * duplication and then convert it back to query string.
       */
      return objectToQueryString(
        queryStringToObject(
          objectToQueryString({
            ...otherObject,
            ...parsedUtmObject,
          })
        )
      )
    },
}
