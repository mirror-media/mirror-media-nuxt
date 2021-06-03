import _ from 'lodash'
import { fetchWatch } from '../api'

export default {
  namespaced: true,
  state() {
    return {
      data: {},
      watch: {},
    }
  },
  actions: {
    FETCH_WATCH: ({ commit }, { name }) => {
      return fetchWatch(name)
        .then((data) => {
          commit('SET_WATCH', _.get(data, 'items.0'))
          return Promise.resolve(data)
        })
        .catch((err) => Promise.reject(err))
    },
  },
  mutations: {
    SET_DATA(state, data) {
      state.data = data
    },
    SET_WATCH(state, data) {
      state.watch = data
    },
    PUSH_ITEMS(state, items) {
      state.data._items.push(...items)
    },
  },
  getters: {
    items(state) {
      return _.get(state, ['data', '_items'], [])
    },
  },
}
