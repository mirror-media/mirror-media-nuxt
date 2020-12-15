import { checkStoryCategoryHasMemberOnly, getStoryPath } from '../article'

describe('checkStoryCategoryHasMemberOnly function', function () {
  test('should return false if there is no truthy isMemberOnly property in the categories of story', function () {
    const mockStory = {
      categories: [{}],
    }
    expect(checkStoryCategoryHasMemberOnly(mockStory)).toBe(false)
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
    expect(checkStoryCategoryHasMemberOnly(mockStory)).toBe(true)
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
