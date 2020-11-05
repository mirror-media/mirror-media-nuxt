export function getAdSizeType(adSize = []) {
  /**
   * see: https://developers.google.com/doubleclick-gpt/guides/ad-sizes
   * Ad size should be just ONE of these cases
   */
  const sizeValidators = [
    function fixed() {
      return checkFixedSize(adSize) ? 'fixed' : undefined
    },
    function multi() {
      return adSize.length > 0 && adSize.every(checkFixedSize)
        ? 'multi'
        : undefined
    },
    function fluid() {
      return adSize.length === 1 && adSize[0] === 'fluid' ? 'fluid' : undefined
    },
  ]

  // output 'fixed', 'multi, 'fluid' or undefined
  const sizeValidator = sizeValidators.find(function findTruth(validator) {
    return validator()
  })

  if (typeof sizeValidator === 'function') {
    return sizeValidator()
  }
  return undefined

  function checkFixedSize(array = []) {
    return (
      array.length === 2 &&
      Number.isFinite(array[0]) &&
      Number.isFinite(array[1])
    )
  }
}
