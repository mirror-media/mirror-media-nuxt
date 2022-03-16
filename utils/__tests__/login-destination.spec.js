import localforage from 'localforage'
import redirectDestination from '../redirect-destination'

describe('set method', function () {
  test('should set destination by "/section/member" with localforage setItem if route parameter is missing', async function () {
    const spySetItem = jest
      .spyOn(localforage, 'setItem')
      .mockImplementation(() => {})
    await redirectDestination.set()
    expect(spySetItem).toHaveBeenCalledWith(
      'mm-login-destination',
      '/section/member'
    )
  })
  test('should set destination by route parameter with localforage setItem', async function () {
    const spySetItem = jest
      .spyOn(localforage, 'setItem')
      .mockImplementation(() => {})
    const destinationMock = '/destination'
    const routeMock = {
      query: {
        destination: destinationMock,
      },
    }
    await redirectDestination.set(routeMock)
    expect(spySetItem).toHaveBeenCalledWith(
      'mm-login-destination',
      destinationMock
    )
  })
})

describe('redirect method', function () {
  test('should call window.location.replace with proper destination in the storage', async function () {
    const destinationMock = '/destination'
    jest
      .spyOn(localforage, 'getItem')
      .mockImplementation(() => Promise.resolve(destinationMock))
    delete window.location
    window.location = {
      replace: jest.fn(),
    }
    await redirectDestination.redirect()
    expect(window.location.replace).toHaveBeenCalledWith(destinationMock)
  })
  test('should call localforage removeItem method if we call the redirect method', async function () {
    const spyRemoveItem = jest
      .spyOn(localforage, 'removeItem')
      .mockImplementation(() => {})
    await redirectDestination.redirect()
    expect(spyRemoveItem).toHaveBeenCalledWith('mm-login-destination')
  })
  test('should redirect to "/section/member" if destination from storage is missing', async function () {
    jest
      .spyOn(localforage, 'getItem')
      .mockImplementation(() => Promise.resolve(undefined))
    delete window.location
    window.location = {
      replace: jest.fn(),
    }
    await redirectDestination.redirect()
    expect(window.location.replace).toHaveBeenCalledWith('/section/member')
  })
})
