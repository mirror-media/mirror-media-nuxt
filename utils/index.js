import styleVariables from '~/scss/_variables.scss'

// [0, -0, 0n, '', null, undefined, NaN] -> []
function isTruthy(val) {
  return val
}

function getSectionColor(name) {
  const color = styleVariables[`section-color-${name}`]

  if (!color) {
    // eslint-disable-next-line no-console
    console.warn(
      'Unable to find the section color. Please provide a vaild section name.'
    )

    return '#bcbcbc'
  }

  return color
}

export { isTruthy, getSectionColor }
