/* global FB:readonly */

import { onMounted } from '@nuxtjs/composition-api'

export { useFbPagePlugin }

let isFbSdkLoading = false
let hasFbSdkLoaded = false

function useFbPagePlugin() {
  onMounted(() => {
    insertFbRootDiv()

    const theFirstTime = loadFbSdk()

    if (!theFirstTime && hasFbSdkLoaded) {
      FB.XFBML.parse()
    }
  })
}

function loadFbSdk() {
  if (isFbSdkLoading || hasFbSdkLoaded) {
    return false
  }

  isFbSdkLoading = true

  window.fbAsyncInit = () => {
    isFbSdkLoading = false
    hasFbSdkLoaded = true

    FB.init({
      xfbml: true,
      version: 'v8.0',
    })
  }

  insertSdkScript()

  return true

  function insertSdkScript() {
    const fbSdkScript = document.createElement('script')

    fbSdkScript.addEventListener('error', function handleError() {
      isFbSdkLoading = false
    })

    fbSdkScript.src = 'https://connect.facebook.net/zh_TW/sdk.js'
    document.body.appendChild(fbSdkScript)
  }
}

function insertFbRootDiv() {
  if (document.getElementById('fb-root')) {
    return
  }

  const fbRoot = document.createElement('div')
  fbRoot.id = 'fb-root'
  document.body.appendChild(fbRoot)
}
