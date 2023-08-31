import {
  reactive,
  onBeforeMount,
  onBeforeUnmount,
  useContext,
} from '@nuxtjs/composition-api'
import { rafWithDebounce } from '~/utils/animation.js'

function useViewport() {
  onBeforeMount(() => {
    updateViewport()

    window.addEventListener('resize', updateViewportWithRaf)
    window.addEventListener('orientationChange', updateViewportWithRaf)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateViewportWithRaf)
    window.removeEventListener('orientationChange', updateViewportWithRaf)
  })

  const viewport = reactive({
    width: 0,
    height: 0,
  })
  const { store } = useContext()

  function updateViewport() {
    /**
     * 不用 document.documentElement.clientWidth 和 .clientHeight 的原因：
     * 為了與 CSS media queries 判斷寬高的方式相同
     */
    ;({ innerWidth: viewport.width, innerHeight: viewport.height } = window)

    store?.commit('viewport/setViewport', viewport)
  }

  function updateViewportWithRaf() {
    rafWithDebounce(() => {
      updateViewport()
    })
  }
}

export { useViewport }
