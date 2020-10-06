export { rafWithDebounce }

function rafWithDebounce(func) {
  let isTicking = false

  return (function immediatelySetRafWithDebounce() {
    if (isTicking) {
      return
    }

    isTicking = true

    window.requestAnimationFrame(doFunc)

    function doFunc() {
      func()
      isTicking = false
    }
  })()
}
