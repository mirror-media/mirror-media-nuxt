jest.mock('axios')
const axios = require('axios')
const { createProxy } = require('../helpers')

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
