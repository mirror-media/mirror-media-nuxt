import { onMounted, useStore } from '@nuxtjs/composition-api'
function sendCustomEventToFbPixel(customEvent) {
  window.fbq('trackCustom', customEvent)
}

function sendMemberPageViewToFbPixel() {
  const { getters } = useStore()
  const isLoggedIn = getters['membership/isLoggedIn']
  onMounted(() => {
    if (isLoggedIn) {
      window.fbq('trackCustom', 'memberPageView')
    }
  })
}
export { sendCustomEventToFbPixel, sendMemberPageViewToFbPixel }
