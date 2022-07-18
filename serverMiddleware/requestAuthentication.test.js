import axios from 'axios'
import requestAuthentication from './requestAuthentication'

// mock axios
jest.mock('axios')

/**
 *  @typedef {Object} ResponseMockObject
 *  @property {Object} mockResponse
 *  @property {jest.Mock} mockResponse.status
 *  @property {jest.Mock} mockStatusFunc
 *  @property {jest.Mock} mockJsonFunc
 */

/**
 *  @return {ResponseMockObject}
 */
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

describe('Test requestAuthentication middlware function', () => {
  const originalConsole = {}

  beforeAll(() => {
    originalConsole.log = console.log
    originalConsole.error = console.error
    console.log = jest.fn()
    console.error = jest.fn()
  })

  afterAll(() => {
    console.log = originalConsole.log
    console.error = originalConsole.error
  })

  test('It should handle request data and call `next()` to next middleware', () => {
    const mw = requestAuthentication()
    const mocks = {
      req: {
        headers: {
          authorization: 'Bearer 12345678',
        },
      },
    }
    const { mockResponse } = createResponseMock()
    const mockNext = jest.fn()

    axios.mockClear()
    axios.get = axios.get = jest.fn().mockResolvedValue({
      data: {
        tokenState: 'OK',
      },
    })

    expect.hasAssertions()

    return Promise.resolve(mw(mocks.req, mockResponse, mockNext)).then(() => {
      const {
        headers: { Authorization },
      } = axios.get.mock.calls[0][1]

      expect(Authorization).toBe('Bearer 12345678')
      expect(mockNext).toHaveBeenCalled()
    })
  })

  test('It should response with status code `400` and status text `fail` when Autorization header is missing', () => {
    const mw = requestAuthentication()
    const mocks = {
      req: {
        headers: {},
      },
    }
    const { mockResponse, mockStatusFunc, mockJsonFunc } = createResponseMock()
    const mockNext = jest.fn()

    expect.hasAssertions()

    return Promise.resolve(mw(mocks.req, mockResponse, mockNext)).then(() => {
      expect(mockStatusFunc.mock.calls[0][0]).toBe(400)
      expect(mockJsonFunc.mock.calls[0][0]).toEqual({
        status: 'fail',
        data: expect.any(Object),
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  test('It should response with status code `401` and status text `fail` when authentication failed', () => {
    const mw = requestAuthentication()
    const mocks = {
      req: {
        headers: {
          authorization: 'Bearer 12345678',
        },
      },
    }
    const { mockResponse, mockStatusFunc, mockJsonFunc } = createResponseMock()
    const mockNext = jest.fn()

    axios.mockClear()
    axios.get = jest.fn().mockResolvedValue({
      data: {
        tokenState: 'Not OK',
      },
    })

    expect.hasAssertions()

    return Promise.resolve(mw(mocks.req, mockResponse, mockNext)).then(() => {
      expect(mockStatusFunc.mock.calls[0][0]).toBe(401)
      expect(mockJsonFunc.mock.calls[0][0]).toEqual({
        status: 'fail',
        data: expect.any(Object),
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  test('It should response with status code `500` and status text `error` when encountered an error', () => {
    const mw = requestAuthentication()
    const mocks = {
      req: {
        headers: {
          authorization: 'Bearer 12345678',
        },
      },
    }
    const { mockResponse, mockStatusFunc, mockJsonFunc } = createResponseMock()
    const mockNext = jest.fn()

    axios.mockClear()
    axios.get = jest.fn().mockRejectedValue(new Error('axios error'))

    expect.hasAssertions()

    return Promise.resolve(mw(mocks.req, mockResponse, mockNext)).then(() => {
      expect(mockStatusFunc.mock.calls[0][0]).toBe(500)
      expect(mockJsonFunc.mock.calls[0][0]).toEqual({
        status: 'error',
        message: expect.any(String),
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
