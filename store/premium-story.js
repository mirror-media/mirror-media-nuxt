// The purpose of this store is to communicate premium page data to user-behavior-log plugin
export const state = () => ({
  story: {},
})

export const mutations = {
  SET_STORY(state, story) {
    state.story = story
  },
}
