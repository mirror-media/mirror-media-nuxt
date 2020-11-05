import { ref, computed, onMounted, isRef } from '@nuxtjs/composition-api'

export { useShareFb, useShareLine }

function useShareFb(url) {
  let sharedUrl
  const fbSharedUrl = 'https://www.facebook.com/share.php?u='

  if (isRef(url)) {
    sharedUrl = computed(() => `${fbSharedUrl}${url.value}`)
  } else {
    sharedUrl = ref('')

    onMounted(function setSharedUrl() {
      sharedUrl.value = `${fbSharedUrl}${url || window.location.href}`
    })
  }

  return sharedUrl
}

function useShareLine(url) {
  let sharedUrl
  const lineSharedUrl = 'https://social-plugins.line.me/lineit/share?url='

  if (isRef(url)) {
    sharedUrl = computed(
      () => `${lineSharedUrl}${encodeURIComponent(url.value)}`
    )
  } else {
    sharedUrl = ref('')

    onMounted(function setSharedUrl() {
      sharedUrl.value = `${lineSharedUrl}${encodeURIComponent(
        url || window.location.href
      )}`
    })
  }

  return sharedUrl
}
