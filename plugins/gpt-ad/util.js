import _ from 'lodash'

export const insertGPTScript = function insertGPTScript() {
  const GPTScript = document.createElement('script')
  GPTScript.type = 'text/javascript'
  GPTScript.async = true
  GPTScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js'
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(GPTScript)
}

export const getAdSizeType = function getAdSizeType(adSize = []) {
  /*
   ** see: https://developers.google.com/doubleclick-gpt/guides/ad-sizes
   ** Ad size should be just ONE of there cases
   */
  const sizes = {
    fixed() {
      return checkFixedSize(adSize)
    },
    multi() {
      return adSize.every(checkFixedSize)
    },
    fluid() {
      return adSize.length === 1 && adSize[0] === 'fluid'
    },
  }

  // output 'fixed', 'multi, 'fluid' or undefined
  return _.findKey(sizes, function (validateTheType) {
    return validateTheType()
  })

  function checkFixedSize(array = []) {
    return array.length === 2 && _.isFinite(array[0]) && _.isFinite(array[1])
  }
}
