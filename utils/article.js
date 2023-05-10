import dayjs from './dayjs'
import { ARTICLE_DATE_TIME_POSTFIX } from '~/constants'

function creditHtml({
  writers = [],
  photographers = [],
  designers = [],
  engineers = [],
  cameraMan = [],
  extendByline = [],
}) {
  const data = [
    [writers, '文'],
    [photographers, '攝影'],
    [designers, '設計'],
    [engineers, '工程'],
    [cameraMan, '影音'],
    [extendByline, ''],
  ]

  return data
    .filter(hasAnyAuthors)
    .map(buildCreditHtml)
    .join('&nbsp;&nbsp;&nbsp;&nbsp;')

  function hasAnyAuthors([authors]) {
    return authors.length > 0
  }

  function buildCreditHtml([authors, role]) {
    if (role === '') {
      return authors
    }

    return `${role}｜${authors.map(buildLink).join('&nbsp;')}`
  }

  function buildLink(author) {
    return `<a href="/author/${author.id}" target="_blank" rel="noopener noreferrer">${author.name}</a>`
  }
}

function stripHtmlTags(html = '') {
  return html.replace(/<\/?[^>]+(>|$)/g, '')
}

function doesContainWineName(categories = []) {
  return Boolean(
    categories.find(
      (category) => category.name === 'wine' || category.name === 'wine1'
    )
  )
}

function checkCategoryHasMemberOnly({ categories = [] } = {}) {
  return categories.some(function checkMemberProperty(category) {
    return !!category.isMemberOnly
  })
}

function getStoryPathByType(story) {
  return story.style === 'projects'
    ? `/projects/${story.slug}/index.html`
    : `/story/${story.slug}`
}

function getStoryPath(story = {}) {
  switch (story.style) {
    case 'campaign': {
      return `/campaigns/${story.slug}/index.html`
    }
    case 'projects': {
      return `/projects/${story.slug}/index.html`
    }
    default: {
      return checkCategoryHasMemberOnly(story)
        ? `/premium/${story.slug}`
        : getStoryPathByType(story)
    }
  }
}

function getFormattedTimeStr(time, format = 'YYYY.MM.DD HH:mm') {
  if (dayjs(time).isValid()) {
    return (
      dayjs(time).utcOffset(8).format(format) + ' ' + ARTICLE_DATE_TIME_POSTFIX
    )
  } else {
    return 'Invalid Date'
  }
}

export {
  creditHtml,
  stripHtmlTags,
  doesContainWineName,
  checkCategoryHasMemberOnly,
  getStoryPath,
  getFormattedTimeStr,
}
