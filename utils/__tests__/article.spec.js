import {
  stripHtmlTags,
  doesContainWineName,
  checkCategoryHasMemberOnly,
  getStoryPath,
} from '../article'

describe('the "stripHtmlTags" function', function () {
  it('strips html tags', function () {
    expect(
      stripHtmlTags(
        '<div><script></script><p>foo</p><p>bar</p><p>123</p></div>'
      )
    ).toBe('foobar123')
  })

  it('returns the same result if there are no html tags', function () {
    expect(stripHtmlTags('foobar123')).toBe('foobar123')
  })
})

test('the "doesContainWineName" function', function () {
  expect(
    doesContainWineName([
      { name: 'test-1' },
      { name: 'wine' },
      { name: 'test-2' },
    ])
  ).toBe(true)
  expect(doesContainWineName([{ name: 'test' }])).toBe(false)
})

describe('checkCategoryHasMemberOnly function', function () {
  test('should return false if there is no truthy isMemberOnly property in the categories of story', function () {
    const mockStory = {
      categories: [{}],
    }
    expect(checkCategoryHasMemberOnly(mockStory)).toBe(false)
  })
  test('should return true if there is at least one truthy isMemberOnly property in the categories of story', function () {
    const mockStory = {
      categories: [
        {},
        {
          isMemberOnly: true,
        },
      ],
    }
    expect(checkCategoryHasMemberOnly(mockStory)).toBe(true)
  })
})

describe('getStoryPath function', function () {
  test('should return the path begin with /story if the story is not premium', function () {
    const mockSlug = 'slug'
    const mockStory = {
      categories: [{}],
      slug: mockSlug,
    }
    expect(getStoryPath(mockStory)).toBe(`/story/${mockSlug}`)
  })
  test('should return the path begin with /premium if the story is premium', function () {
    const mockSlug = 'slug'
    const mockStory = {
      categories: [{}, { isMemberOnly: true }],
      slug: mockSlug,
    }
    expect(getStoryPath(mockStory)).toBe(`/premium/${mockSlug}`)
  })
})
