import { buildParams, buildYoutubeParams } from '../index'

describe('buildParams function', () => {
  test('should return empty string', () => {
    expect(buildParams()).toBe('')
    expect(buildParams([])).toBe('')
    expect(buildParams({})).toBe('')
    expect(buildParams(1234)).toBe('')
    expect(buildParams('string')).toBe('')
    expect(buildParams(null)).toBe('')
    expect(buildParams(undefined)).toBe('')
  })

  test('should return correct string', () => {
    expect(
      buildParams({ page: 1, sort: '-publishedDate', maxResults: 10 })
    ).toBe('?page=1&sort=-publishedDate&max_results=10')

    expect(
      buildParams({
        slug: '20180125pol010',
        isAudioSiteOnly: false,
        clean: 'content',
      })
    ).toBe(
      '?where=%7B%22slug%22%3A%2220180125pol010%22%2C%22isAudioSiteOnly%22%3Afalse%7D&clean=content'
    )

    expect(
      buildParams({
        page: 1,
        categories: ['5979ac0de531830d00e330a7', '5979ac33e531830d00e330a9'],
        isAudioSiteOnly: false,
        maxResults: 10,
      })
    ).toBe(
      '?page=1&where=%7B%22categories%22%3A%7B%22%24in%22%3A%5B%225979ac0de531830d00e330a7%22%2C%225979ac33e531830d00e330a9%22%5D%7D%2C%22isAudioSiteOnly%22%3Afalse%7D&max_results=10'
    )

    expect(buildParams({ id: '584fb40ab854000d002d23cb' })).toBe(
      '?where=%7B%22_id%22%3A%22584fb40ab854000d002d23cb%22%7D'
    )

    expect(
      buildParams({
        $or: [
          {
            writers: '584fb40ab854000d002d23cb',
            photographers: '584fb40ab854000d002d23cb',
          },
        ],
        maxResults: 10,
      })
    ).toBe(
      '?where=%7B%22%24or%22%3A%5B%7B%22writers%22%3A%22584fb40ab854000d002d23cb%22%2C%22photographers%22%3A%22584fb40ab854000d002d23cb%22%7D%5D%7D&max_results=10'
    )

    expect(buildParams({ endpoint: 'sections' })).toBe('?endpoint=sections')
    expect(buildParams({ endpoint: ['sections', 'topics'] })).toBe(
      '?endpoint=sections&endpoint=topics'
    )
  })
})

describe('buildYoutubeParams function', () => {
  test('should return empty string', () => {
    expect(buildYoutubeParams()).toBe('')
    expect(buildYoutubeParams([])).toBe('')
    expect(buildYoutubeParams({})).toBe('')
    expect(buildYoutubeParams(1234)).toBe('')
    expect(buildYoutubeParams('string')).toBe('')
    expect(buildYoutubeParams(null)).toBe('')
    expect(buildYoutubeParams(undefined)).toBe('')
  })

  test('should return correct string', () => {
    const data = {
      maxResults: 10,
      order: 'date',
      part: 'snippet',
      id: 'TEST',
      channelId: 'ABC',
      safeSearch: 'none',
      ids: ['abc', 'efg'],
    }

    expect(buildYoutubeParams({ id: data.id })).toBe(`?id=${data.id}`)

    expect(buildYoutubeParams({ ids: data.ids })).toBe(
      `?ids=${data.ids[0]}&ids=${data.ids[1]}`
    )

    expect(buildYoutubeParams(data)).toBe(
      `?maxResults=${data.maxResults}&order=${data.order}&part=${data.part}&id=${data.id}&channelId=${data.channelId}&safeSearch=${data.safeSearch}&ids=${data.ids[0]}&ids=${data.ids[1]}`
    )
  })
})
