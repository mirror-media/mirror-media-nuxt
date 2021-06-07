import { createStore } from '~/deprecated/topic-page/store'

export const state = () => createStore().state
export const mutations = createStore().mutations
export const actions = createStore().actions
export const getters = createStore().getters
