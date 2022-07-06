const { PubSub } = require('@google-cloud/pubsub')
jest.mock('axios')
const axios = require('axios')
const {
  createProxy,
  createOrderNumberByTaipeiTZ,
  publishMessageToPubSub,
  sendResponse,
} = require('../helpers')

// createProxy
describe('createProxy helper function', function () {
  const mockRes = {
    setHeader: jest.fn(),
    status: jest.fn(() => ({
      send: jest.fn(),
    })),
    send: jest.fn(),
  }

  describe('behaviors about axios parameters', function () {
    beforeEach(() => {
      axios.mockReturnValue(
        Promise.resolve({
          data: {},
        })
      )
    })

    test('should called with dynamic base url and request url by axios', function () {
      const mockBaseUrl = 'http://mock/api'
      const mockReqUrl = '/mockEndpoint'
      const proxy = createProxy(mockBaseUrl)
      proxy({ url: mockReqUrl }, mockRes, () => {})
      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `${mockBaseUrl}${mockReqUrl}`,
        })
      )
    })

    test('should called with dynamic request header by axios', function () {
      const mockReqHeaderAuthorization = 'Bearer token'
      const proxy = createProxy()
      proxy(
        {
          headers: { Authorization: mockReqHeaderAuthorization },
        },
        mockRes,
        () => {}
      )
      expect(axios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: {
            Authorization: mockReqHeaderAuthorization,
          },
        })
      )
    })
  })
})

// createOrderNumberByTaipeiTZ
describe('createOrderNumberByTaipeiTZ helper function', function () {
  const utcPM10 = new Date('2021-11-07T22:00:00+00:00')
  const utcAM10 = new Date('2021-11-07T10:00:00+00:00')
  const astAM10 = new Date('2021-11-07T10:00:00-09:00')

  const tests = [
    {
      name: '22:00 at utc',
      args: {
        t: utcPM10,
        id: 1,
      },
      wantOrderNumber: 'M21110800001',
    },
    {
      name: '10:00 at utc',
      args: {
        t: utcAM10,
        id: 1,
      },
      wantOrderNumber: 'M21110700001',
    },
    {
      name: '10:00 at ast',
      args: {
        t: astAM10,
        id: 1,
      },
      wantOrderNumber: 'M21110800001',
    },
    {
      name: '10:00 at ast',
      args: {
        t: astAM10,
        id: 100001,
      },
      wantOrderNumber: 'M21110800001',
    },
  ]

  describe.each(tests)('$name', ({ name, args, wantOrderNumber }) => {
    test(`return ${wantOrderNumber}`, () => {
      const gotOrderNumber = createOrderNumberByTaipeiTZ(args.t, args.id)

      expect(gotOrderNumber).toBe(wantOrderNumber)
    })
  })
})

// publishMessageToPubSub
let mockPublishJSON = jest.fn()

// mock non-default class exports
jest.mock('@google-cloud/pubsub', () => {
  return {
    // mock PubSub named exports
    PubSub: jest.fn().mockImplementation(() => {
      return {
        // mock PubSub#topic method
        topic: jest.fn().mockImplementation(() => {
          return {
            // mock Topic#publishJSON method
            publishJSON: mockPublishJSON,
          }
        }),
      }
    }),
  }
})

describe('publishMessageToPubSub helper function', () => {
  const publishMessage = {
    data: 'mock_pubsub_message_data',
    attributes: 'mock_pubsub_message_attributes',
  }
  const originalConsole = {}

  // create mocks config
  const mocks = {
    topicName: 'mock_topic_name',
    projectId: 'mock_project_id',
  }

  beforeEach(() => {
    // clear all instances and calls to constructor and all methods

    PubSub.mockClear()

    // reset mockPublishJSON
    mockPublishJSON = jest.fn()
  })

  beforeAll(() => {
    originalConsole.error = console.error
    originalConsole.log = console.log
    console.error = jest.fn()
    console.log = jest.fn()
  })

  afterAll(() => {
    console.error = originalConsole.error
    console.log = originalConsole.log
  })

  test('It should publish data to pubsub topic', async () => {
    const result = await publishMessageToPubSub(
      mocks.topicName,
      mocks.projectId,
      publishMessage
    )

    expect(mockPublishJSON.mock.calls[0][0]).toEqual(publishMessage.data)
    expect(mockPublishJSON.mock.calls[0][1]).toEqual(publishMessage.attributes)
    expect(result).toBe(true)
  })

  test('It should handle pubsub error', async () => {
    // mock `Topic#publishJSON` to throw error
    mockPublishJSON.mockImplementation(() => {
      throw new Error('mock pulishJSON error')
    })

    const mockErrorFunc = jest.fn()
    console.error = mockErrorFunc

    const result = await publishMessageToPubSub(
      mocks.topicName,
      mocks.projectId,
      publishMessage
    )

    expect(mockErrorFunc).toHaveBeenCalled()
    expect(result).toBe(false)
  })
})

// sendResponse
function createResponseMock() {
  const mockJsonFunc = jest.fn()
  const mockStatusFunc = jest.fn()
  mockStatusFunc.mockReturnValue({
    json: mockJsonFunc,
  })

  return {
    mockResponse: {
      status: mockStatusFunc,
    },
    mockStatusFunc,
    mockJsonFunc,
  }
}

describe('sendResponse helper function', () => {
  test('It should response with `status` and `data` when `status` is `success` or `fail`', () => {
    const status = 'success'
    const code = 200
    const data = { title: 'Success.' }
    const { mockResponse, mockStatusFunc, mockJsonFunc } = createResponseMock()

    sendResponse({
      status,
      code,
      data,
      res: mockResponse,
    })

    expect(mockStatusFunc.mock.calls[0][0]).toBe(code)
    expect(mockJsonFunc.mock.calls[0][0]).toEqual({
      status,
      data,
    })
  })

  test('It should response with `status` and `message` when `status` is `error`', () => {
    const status = 'error'
    const code = 500
    const message = 'Error.'
    const { mockResponse, mockStatusFunc, mockJsonFunc } = createResponseMock()

    sendResponse({
      status,
      code,
      message,
      res: mockResponse,
    })

    expect(mockStatusFunc.mock.calls[0][0]).toBe(code)
    expect(mockJsonFunc.mock.calls[0][0]).toEqual({
      status,
      message,
    })
  })

  test('It should response with `status` and `message` when `status` is not valid', () => {
    const status = 'other'
    const code = 200
    const message = 'other message'
    const data = { title: 'other data' }
    const { mockResponse, mockStatusFunc, mockJsonFunc } = createResponseMock()

    sendResponse({
      status,
      code,
      message,
      data,
      res: mockResponse,
    })

    expect(mockStatusFunc.mock.calls[0][0]).toBe(500)
    expect(mockJsonFunc.mock.calls[0][0]).toEqual({
      status: 'error',
      message: expect.any(String),
    })
  })

  test('It should throw error when `res` is not valid', () => {
    const status = 'other'
    const code = 200
    const message = 'other message'
    const data = { title: 'other data' }

    expect(() => {
      sendResponse({
        status,
        code,
        message,
        data,
      })
    }).toThrow(TypeError)
  })
})
