import { mockUserAgent } from 'jest-useragent-mock'
import { get as getCookie, set as setCookie } from 'vue-cookie'
import uuid from 'uuid/v4'
import { createUserBehaviorLog } from '../index'

jest.mock('vue-cookie')
jest.mock('uuid/v4')

describe('properties of log', function () {
  let mockBrowser
  let mockBrowserVersion
  beforeEach(() => {
    mockBrowser = 'Chrome'
    mockBrowserVersion = '51.0.2704.103'
    const mockAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) ${mockBrowser}/${mockBrowserVersion} Safari/537.36`
    mockUserAgent(mockAgent)
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('parameters assign to output directly', async function () {
    const mockParameter = {
      eventType: 'click',
      category: '',
      description: '',
    }

    const log = await createUserBehaviorLog(mockParameter)
    expect(log).toMatchObject({
      'event-type': mockParameter.eventType,
      category: mockParameter.category,
      description: mockParameter.description,
    })
  })

  test('target parameter, use for assign to output directly', async function () {
    const mockParameter = {
      target: {
        textContent: '<div>mock text content</div>',
        tagName: 'DIV',
        className: 'mock-class-name',
        id: 'mock-id',
      },
    }

    const log = await createUserBehaviorLog(mockParameter)
    expect(log).toMatchObject({
      'target-tag-name': mockParameter.target.tagName,
      'target-tag-class': mockParameter.target.className,
      'target-tag-id': mockParameter.target.id,
      'target-text': 'mock text content',
    })
  })

  test('target parameter, textContent output', async function () {
    const mockParameter = {
      target: {
        textContent: '<div>mock text content</div>',
      },
    }
    const log = await createUserBehaviorLog(mockParameter)
    expect(log).toMatchObject({
      'target-text': 'mock text content',
    })

    mockParameter.target.textContent =
      '<div>01234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890</div>'
    const logWithTruncatedTextContent = await createUserBehaviorLog(
      mockParameter
    )
    expect(logWithTruncatedTextContent).toMatchObject({
      'target-text':
        '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789…',
    })
  })

  test('target parameter, which affect redirect-to output', async function () {
    const mockParameter = {
      target: {
        tagName: 'DIV',
      },
    }
    const log = await createUserBehaviorLog(mockParameter)
    expect(log).toMatchObject({
      'redirect-to': undefined,
    })

    mockParameter.target.tagName = 'A'
    const mockHref = 'https://www.google.com'
    mockParameter.target.href = mockHref
    const logWithMockHref = await createUserBehaviorLog(mockParameter)
    expect(logWithMockHref).toMatchObject({
      'redirect-to': mockHref,
    })
  })

  test('target parameter, which affect referrer output', async function () {
    const mockHref = 'https://www.google.com'
    const mockParameter = {
      referrer: mockHref,
    }
    const log = await createUserBehaviorLog(mockParameter)
    expect(log).toMatchObject({
      referrer: mockHref,
    })

    const mockParameterTargetDiv = {
      target: {
        tagName: 'DIV',
      },
    }
    const logWithTargetDiv = await createUserBehaviorLog(mockParameterTargetDiv)
    expect(logWithTargetDiv).toMatchObject({
      referrer: undefined,
    })

    global.window = Object.create(window)
    const mockLocationHref = 'http://dummy.com'
    Object.defineProperty(window, 'location', {
      value: {
        href: mockLocationHref,
      },
    })
    const mockParameterTarget = {
      target: {
        tagName: 'A',
      },
    }
    const logWithTargetALink = await createUserBehaviorLog(mockParameterTarget)
    expect(logWithTargetALink).toMatchObject({
      referrer: mockLocationHref,
    })
  })

  test('target parameter, which affect rref output', async function () {
    const mockParameter = {
      target: {
        tagName: 'DIV',
      },
    }
    const log = await createUserBehaviorLog(mockParameter)
    expect(log).toMatchObject({
      rref: undefined,
    })

    const mockParameterRelated = {
      target: {
        tagName: 'A',
        id: 'related',
      },
    }
    const logWithRelated = await createUserBehaviorLog(mockParameterRelated)
    expect(logWithRelated).toMatchObject({
      rref: 'related',
    })

    const mockParameterRecommend = {
      target: {
        tagName: 'A',
        id: 'recommend',
      },
    }
    const logWithRecommend = await createUserBehaviorLog(mockParameterRecommend)
    expect(logWithRecommend).toMatchObject({
      rref: 'recommend',
    })
  })

  test('target parameter, which is nested DOM node', async function () {
    const mockHref = 'https://www.google.com'
    const mockParameter = {
      target: {
        tagName: 'DIV',
        parentNode: {
          tagName: 'DIV',
          parentNode: {
            tagName: 'A',
            href: mockHref,
          },
        },
      },
    }
    const log = await createUserBehaviorLog(mockParameter)
    expect(log).toMatchObject({
      'redirect-to': mockHref,
    })
  })

  test('browser name and browser version', async function () {
    const log = await createUserBehaviorLog({})
    expect(log).toMatchObject({
      browser: {
        name: mockBrowser,
        version: mockBrowserVersion,
      },
      'browser-name': mockBrowser,
      'browser-version': mockBrowserVersion,
    })
  })

  test('client-os name and client-os version', async function () {
    const log = await createUserBehaviorLog({})
    expect(log).toMatchObject({
      'client-os': {
        name: 'macOS',
        version: '10.15.5',
      },
      'client-os-name': 'macOS',
      'client-os-version': '10.15.5',
    })
  })

  test('curr-url', async function () {
    global.window = Object.create(window)
    const mockLocationHref = 'http://dummy.com'
    Object.defineProperty(window, 'location', {
      value: {
        href: mockLocationHref,
      },
    })
    const log = await createUserBehaviorLog({})
    expect(log).toMatchObject({
      'curr-url': mockLocationHref,
    })
  })

  test('datetime', async function () {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2019-04-07T10:20:30Z')

    dateNow.mockImplementation(() => dateNowTime)

    const log = await createUserBehaviorLog({})
    expect(log).toMatchObject({
      datetime: `2019.04.07 ${10 + 8}:20:30`,
    })
  })

  test('target-window-size-width and target-window-size-height', async function () {
    const mockWidth = 123
    jest
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockImplementation(() => mockWidth)
    const mockHeight = 123
    jest
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => mockHeight)
    const log = await createUserBehaviorLog({})
    expect(log).toMatchObject({
      'target-window-size': {
        width: mockWidth,
        height: mockHeight,
      },
      'target-window-size-width': mockWidth,
      'target-window-size-height': mockHeight,
    })

    jest
      .spyOn(document.documentElement, 'clientWidth', 'get')
      .mockImplementation(() => 0)
    const mockWidthInBody = 456
    jest
      .spyOn(document.body, 'clientWidth', 'get')
      .mockImplementation(() => mockWidthInBody)
    jest
      .spyOn(document.documentElement, 'clientHeight', 'get')
      .mockImplementation(() => 0)
    const mockHeightInBody = 456
    jest
      .spyOn(document.body, 'clientHeight', 'get')
      .mockImplementation(() => mockHeightInBody)
    const logWithBodyDimension = await createUserBehaviorLog({})
    expect(logWithBodyDimension).toMatchObject({
      'target-window-size': {
        width: mockWidthInBody,
        height: mockHeightInBody,
      },
      'target-window-size-width': mockWidthInBody,
      'target-window-size-height': mockHeightInBody,
    })
  })

  test('rest the additional parameters', async function () {
    const mockParameter = {
      additional: 'additional',
      keys: 'keys',
      not: 'not',
      destructed: 'destructed',
    }
    const log = await createUserBehaviorLog(mockParameter)
    expect(log).toMatchObject(mockParameter)
  })

  test('client-id, session-id and current-runtime-id in a fresh env(no cookies)', async function () {
    const mockuuid = 'uuid'
    uuid.mockReturnValue(mockuuid)
    getCookie.mockReturnValue(undefined) // like we will never get the cookie we want
    setCookie.mockReturnValue(true)
    const log = await createUserBehaviorLog({})
    expect(log).toMatchObject({
      'client-id': mockuuid,
      'session-id': mockuuid,
      'current-runtime-id': mockuuid,
    })

    // get the cookie first, if nothing, set the cookie we want
    expect(getCookie).toHaveBeenCalledWith('mmid')
    expect(setCookie).toHaveBeenCalledWith('mmid', mockuuid, {
      expires: 10 * 365 * 24 + 'h',
    })
    expect(getCookie).toHaveBeenCalledWith('mmid-session')
    expect(setCookie).toHaveBeenCalledWith('mmid-session', mockuuid, {
      expires: '30m',
    })
  })

  test('client-id, session-id and current-runtime-id in a messy env(some of the cookies exist)', async function () {
    const mockuuid = 'uuid'
    uuid.mockReturnValue(mockuuid)
    getCookie.mockReturnValue(mockuuid) // like we always can get the cookie we want
    setCookie.mockReturnValue(true)
    const log = await createUserBehaviorLog({})
    expect(log).toMatchObject({
      'client-id': mockuuid,
      'session-id': mockuuid,
      'current-runtime-id': mockuuid,
    })

    expect(getCookie).toHaveBeenCalledWith('mmid')
    expect(setCookie).not.toHaveBeenCalledWith('mmid', mockuuid, {
      expires: 10 * 365 * 24 + 'h',
    })
    expect(getCookie).toHaveBeenCalledWith('mmid-session')
    expect(setCookie).not.toHaveBeenCalledWith('mmid-session', mockuuid, {
      expires: '30m',
    })
  })

  test('current-runtime-start in a fresh env(no any runtime setting in window)', async function () {
    const dateNow = jest.spyOn(Date, 'now')
    const dateNowTime = new Date('2019-04-07T10:20:30Z')

    dateNow.mockImplementation(() => dateNowTime)

    const log = await createUserBehaviorLog({})
    expect(log).toMatchObject({
      'current-runtime-start': `2019.04.07 ${10 + 8}:20:30`,
    })
  })
})
