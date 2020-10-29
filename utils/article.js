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

export { creditHtml }
