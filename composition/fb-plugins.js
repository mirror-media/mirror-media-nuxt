/* global FB:readonly */

import { ref, onMounted } from '@nuxtjs/composition-api'

export { useFbPagePlugin, useFbQuotePlugin }

let isFbSdkLoading = false
let hasFbSdkLoaded = false

function useFbPagePlugin() {
  const fbPage = ref(undefined)

  onMounted(() => {
    insertRootDiv()
    initPlugin(fbPage.value)
  })

  return fbPage
}

function useFbQuotePlugin() {
  onMounted(() => {
    insertRootDiv()
    insertQuoteDiv()
    initPlugin(document.getElementById('fb-quote-wrapper'))
  })
}

function initPlugin(parsedDom = document.body) {
  const theFirstTime = loadSdk()

  if (!theFirstTime && hasFbSdkLoaded) {
    // Docs: https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse
    FB.XFBML.parse(parsedDom)
  }
}

function loadSdk() {
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

function insertRootDiv() {
  if (document.getElementById('fb-root')) {
    return
  }

  const fbRoot = document.createElement('div')
  fbRoot.id = 'fb-root'
  document.body.appendChild(fbRoot)
}

function insertQuoteDiv() {
  if (document.getElementById('fb-quote-wrapper')) {
    return
  }

  const fbQuoteWrapper = document.createElement('div')
  fbQuoteWrapper.id = 'fb-quote-wrapper'
  fbQuoteWrapper.innerHTML = '<div class="fb-quote"></div>'
  document.body.appendChild(fbQuoteWrapper)
}
