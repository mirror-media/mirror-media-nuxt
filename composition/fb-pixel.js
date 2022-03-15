import { onMounted, useStore } from '@nuxtjs/composition-api'
function useCustomEventToFbPixel(customEvent) {
  window.fbq('trackCustom', customEvent)
}

function useMemberPageViewToFbPixel() {
  const { getters } = useStore()
  const isLoggedIn = getters['membership/isLoggedIn']
  onMounted(() => {
    if (isLoggedIn) {
      window.fbq('trackCustom', 'memberPageView')
    }
  })
}
export { useCustomEventToFbPixel, useMemberPageViewToFbPixel }
