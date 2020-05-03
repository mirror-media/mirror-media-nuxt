export default (context, inject) => {
  inject('requestTick', requestTick)
}

let ticking = false
function requestTick(fn) {
  if (ticking) {
    return
  }

  ticking = true

  window.requestAnimationFrame(function () {
    fn()
    ticking = false
  })
}
