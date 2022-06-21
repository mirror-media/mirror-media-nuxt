jest.mock('axios')
const axios = require('axios')
const { createProxy, createOrderNumberByTaipeiTZ } = require('../helpers')

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
