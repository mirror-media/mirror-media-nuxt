import { processResponseItems } from '../youtube'

describe('processResponseItems', () => {
  test('should filter invalid items and return restructured items', () => {
    const videoIdMock = 'POYXvnGlPt8'
    const titleMock = 'test title'
    const thumbnailsUrlMock = 'test url'
    const rawResponseItems = {
      items: [
        {
          id: {
            videoId: videoIdMock,
          },
          snippet: {
            title: titleMock,
            thumbnails: {
              high: {
                url: thumbnailsUrlMock,
              },
            },
          },
        },
        {
          snippet: {
            title: 'Deleted video',
          },
        },
        {
          snippet: {
            title: 'Private video',
          },
        },
      ],
    }
    expect(processResponseItems(rawResponseItems)).toEqual([
      {
        videoId: videoIdMock,
        title: titleMock,
        thumbnails: thumbnailsUrlMock,
      },
    ])
  })
})
