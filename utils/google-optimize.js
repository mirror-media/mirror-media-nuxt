export { fireActivationEvent }

function fireActivationEvent() {
  if (window.dataLayer) {
    this.$nextTick(() => {
      window.dataLayer.push({ event: 'optimize.activate' })
    })
  }
}
