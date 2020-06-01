export function insertGPTScript() {
  const GPTScript = document.createElement('script')
  GPTScript.type = 'text/javascript'
  GPTScript.async = true
  GPTScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js'
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(GPTScript)
}

export function getAdSizeType(adSize = []) {
  /*
   ** see: https://developers.google.com/doubleclick-gpt/guides/ad-sizes
   ** Ad size should be just ONE of these cases
   */
  const sizeValidators = [
    function fixed() {
      return checkFixedSize(adSize)
    },
    function multi() {
      return adSize.every(checkFixedSize)
    },
    function fluid() {
      return adSize.length === 1 && adSize[0] === 'fluid'
    },
  ]

  // output 'fixed', 'multi, 'fluid' or undefined
  return sizeValidators.find(function findTruth(validator) {
    return validator()
  })?.name

  function checkFixedSize(array = []) {
    return (
      array.length === 2 &&
      Number.isFinite(array[0]) &&
      Number.isFinite(array[1])
    )
  }
}
