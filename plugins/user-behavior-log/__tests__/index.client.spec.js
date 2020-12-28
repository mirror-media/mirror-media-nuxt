import { mockUserAgent } from 'jest-useragent-mock'
import flushPromises from 'flush-promises'
import plugin from '../index.client'

beforeEach(() => {
  const mockAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/mockBrowserVersion Safari/537.36'
  mockUserAgent(mockAgent)

  window.navigator.sendBeacon = jest.fn()

  global.Blob = jest.fn()
})

describe('pageview event', function () {
  test('Should send pageview event log to frontend server by Beacon API', async function () {
    expect.assertions(3)

    const mockContext = {
      app: {
        router: {
          beforeEach: (guard) => {
            guard('', '', () => {})
          },
        },
      },
    }
    plugin(mockContext)

    await flushPromises()
    expect(JSON.parse(Blob.mock.calls[0][0])).toMatchObject({
      clientInfo: {
        category: 'whole-site',
        description: '',
        'event-type': 'pageview',
      },
    })
    expect(Blob.mock.calls[0][1]).toEqual({
      type: 'application/json; charset=UTF-8',
    })
    expect(window.navigator.sendBeacon).toHaveBeenCalledWith(
      '/api/v2/tracking',
      new Blob()
    )
  })

  test('Should send pageview event log to frontend server by Beacon API, with additional keyword data in search page', async function () {
    expect.assertions(3)

    const mockKeyword = 'keyword1,keyword2'
    const mockContext = {
      app: {
        router: {
          beforeEach: (guard) => {
            guard(
              {
                name: 'search',
                params: {
                  keyword: mockKeyword,
                },
              },
              '',
              () => {}
            )
          },
        },
      },
    }
    plugin(mockContext)

    await flushPromises()
    expect(JSON.parse(Blob.mock.calls[0][0])).toMatchObject({
      clientInfo: {
        category: 'whole-site',
        description: '',
        'event-type': 'pageview',
        keyword: ['keyword1', 'keyword2'],
      },
    })
    expect(Blob.mock.calls[0][1]).toEqual({
      type: 'application/json; charset=UTF-8',
    })
    expect(window.navigator.sendBeacon).toHaveBeenCalledWith(
      '/api/v2/tracking',
      new Blob()
    )
  })
})

describe('click event', function () {
  test('Should send click event log to frontend server by Beacon API', async function () {
    const mockContext = {
      app: {
        router: {
          beforeEach: () => {},
        },
      },
    }
    plugin(mockContext)

    document.body.click()

    await flushPromises()
    expect(JSON.parse(Blob.mock.calls[0][0])).toMatchObject({
      clientInfo: {
        category: 'whole-site',
        description: '',
        'event-type': 'click',
      },
    })
    expect(Blob.mock.calls[0][1]).toEqual({
      type: 'application/json; charset=UTF-8',
    })
    expect(window.navigator.sendBeacon).toHaveBeenCalledWith(
      '/api/v2/tracking',
      new Blob()
    )
  })
})

describe('exit event', function () {
  test('Should send exit event log to frontend server by Beacon API', async function () {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2019-04-07T10:20:30Z')
    dateNow.mockImplementation(() => dateNowTime)

    const mockContext = {
      app: {
        router: {
          beforeEach: () => {},
        },
      },
    }
    plugin(mockContext)

    window.dispatchEvent(new Event('beforeunload'))

    await flushPromises()

    expect(JSON.parse(Blob.mock.calls[0][0])).toMatchObject({
      clientInfo: {
        category: 'whole-site',
        description: '',
        'event-type': 'exit',
        'exit-time': `2019.04.07 ${10 + 8}:20:30`,
      },
    })
    expect(Blob.mock.calls[0][1]).toEqual({
      type: 'application/json; charset=UTF-8',
    })
    expect(window.navigator.sendBeacon).toHaveBeenCalledWith(
      '/api/v2/tracking',
      new Blob()
    )
  })
})
