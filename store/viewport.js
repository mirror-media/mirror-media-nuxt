import styleVariables from '~/scss/_variables.scss'

const {
  'breakpoint-sm': breakpointSm,
  'breakpoint-md': breakpointMd,
  'breakpoint-xl': breakpointXl,
} = styleVariables

const state = () => ({
  width: 0,
  height: 0,
})

const getters = {
  isViewportWidthUpSm(state) {
    return state.width >= parseInt(breakpointSm, 10)
  },
  isViewportWidthUpMd(state) {
    return state.width >= parseInt(breakpointMd, 10)
  },
  isViewportWidthUpXl(state) {
    return state.width >= parseInt(breakpointXl, 10)
  },
}

const mutations = {
  setViewport(state, viewport = {}) {
    ;({ width: state.width, height: state.height } = viewport)
  },
}

export { state, getters, mutations }
