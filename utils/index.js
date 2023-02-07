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

/**
 * @typedef {Object} ArticleList -  an list of article info
 * @property {string} redirect - a link to redirect other page of external site
 */

/**
 * @param {ArticleList[]} [articleList]
 * @return {ArticleList[]}
 */

function removeArticleWithExternalLink(articleList) {
  if (!articleList || !Array.isArray(articleList)) {
    return []
  }
  return articleList?.filter((item) => {
    const redirectLink = item.redirect?.trim()
    return (
      !redirectLink.startsWith('https://') &&
      !redirectLink.startsWith('http://') &&
      !redirectLink.startsWith('www.')
    )
  })
}
export { isTruthy, getSectionColor, removeArticleWithExternalLink }
