import flushPromises from 'flush-promises'

import UiVideoModal from '../UiVideoModal.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper({
  propsData: {
    embeddedHtml: '',
  },
})

test('display the video', function () {
  /* Arrange */
  const embeddedHtmlMock = '<iframe src="test-src"></iframe>'
  const sut = createWrapper(UiVideoModal, {
    propsData: {
      embeddedHtml: embeddedHtmlMock,
    },
  })

  /* Assert */
  expect(sut.html()).toContain(embeddedHtmlMock)
})

test('open the modal when users click the video', async function () {
  expect.assertions(1)

  /* Arrange */
  const sut = createWrapper(UiVideoModal)

  /* Act */
  sut.get('.curtain').trigger('click')

  await flushPromises()

  /* Assert */
  expect(sut.get('.wrapper').classes('open')).toBe(true)
})

test('close the modal when users click anywhere outside the video', async function () {
  expect.assertions(1)

  /* Arrange */
  const sut = createWrapper(UiVideoModal, {
    data() {
      return {
        shouldOpenModal: true,
      }
    },
  })

  /* Act */
  sut.get('.wrapper').trigger('click')

  await flushPromises()

  /* Assert */
  expect(sut.get('.wrapper').classes('open')).toBe(false)
})

describe('GA events', function () {
  test('emit the "sendGa:open" when users click the video', function () {
    const sut = createWrapper(UiVideoModal)

    sut.get('.curtain').trigger('click')

    expect(sut.emitted()['sendGa:open'][0]).toBeTruthy()
  })

  test('emit the "sendGa:close" when users click anywhere outside the video', function () {
    const sut = createWrapper(UiVideoModal)

    sut.get('.wrapper').trigger('click')

    expect(sut.emitted()['sendGa:close'][0]).toBeTruthy()
  })
})
