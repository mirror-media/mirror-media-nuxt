import { READR_URL } from '~/constants/index'

export function getHref(articleData = {}) {
  const { style = '', slug = '' } = articleData

  const articlesMap = [
    {
      style: 'campaign',
      href: `/campaigns/${slug}/`,
    },
    {
      style: 'projects',
      href: `/projects/${slug}/`,
    },
    {
      style: 'readr',
      href: `${READR_URL}/project/${slug}/`,
    },
  ]

  return (
    articlesMap.find(function doesStyleMatch(articleMap) {
      return style === articleMap.style
    })?.href ?? `/story/${slug}/`
  )
}
