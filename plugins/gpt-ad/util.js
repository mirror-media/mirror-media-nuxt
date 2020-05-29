export const insertGPTScript = function () {
  const GPTScript = document.createElement('script')
  GPTScript.type = 'text/javascript'
  GPTScript.async = true
  GPTScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js'
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(GPTScript)
}
