import UiStoryAnnotation from '../UiStoryAnnotation.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper()

test('should render correct content', () => {
  const contentMock = {
    text: '被註解文字',
    pureAnnotationText: '註解內容',
  }
  const wrapper = createWrapper(UiStoryAnnotation, {
    propsData: {
      content: contentMock,
    },
    data() {
      return {
        shouldOpenAnnotation: true,
      }
    },
  })

  const wrapperHtml = wrapper.html()

  expect(wrapperHtml).toContain(contentMock.text)
  expect(wrapperHtml).toContain('（註）')
  expect(wrapperHtml).toContain(contentMock.pureAnnotationText)
})

test('should toggle an annotation when users click the button', async () => {
  const contentMock = {
    pureAnnotationText: '註解內容',
  }
  const wrapper = createWrapper(UiStoryAnnotation, {
    propsData: {
      content: contentMock,
    },
    stubs: {
      SvgArrowDown: { template: '<svg />' },
    },
  })

  expect(wrapper.html()).not.toContain(contentMock.pureAnnotationText)

  const button = wrapper.get('button')

  await button.trigger('click')

  expect(wrapper.html()).toContain(contentMock.pureAnnotationText)
  expect(wrapper.get('svg').classes('open')).toBe(true)

  await button.trigger('click')

  expect(wrapper.html()).not.toContain(contentMock.pureAnnotationText)
  expect(wrapper.get('svg').classes('open')).toBe(false)
})
