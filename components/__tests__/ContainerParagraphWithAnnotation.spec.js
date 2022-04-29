import ContainerParagraphWithAnnotation from '../ContainerParagraphWithAnnotation.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper()

test('should have correct splitContents computed', () => {
  const wrapper = createWrapper(ContainerParagraphWithAnnotation, {
    propsData: {
      content:
        '一般文字 1<!--__ANNOTATION__={"text":"被註解文字 1","annotation":"<div>註解內容 1</div>","pureAnnotationText":"註解內容 1"}--><!--被註解文字 1-->一般文字 2<!--__ANNOTATION__={"text":"被註解文字 2","annotation":"<div>註解內容 2</div>","pureAnnotationText":"註解內容 2"}--><!--被註解文字 2-->一般文字 3',
    },
  })

  expect(wrapper.vm.splitContents).toEqual([
    { id: 0, html: '一般文字 1' },
    {
      id: 1,
      text: '被註解文字 1',
      annotation: '<div>註解內容 1</div>',
      pureAnnotationText: '註解內容 1',
    },
    { id: 2, html: '一般文字 2' },
    {
      id: 3,
      text: '被註解文字 2',
      annotation: '<div>註解內容 2</div>',
      pureAnnotationText: '註解內容 2',
    },
    { id: 4, html: '一般文字 3' },
  ])

  wrapper.setProps({
    content:
      '<!--__ANNOTATION__={"text":"被註解文字","annotation":"<div>註解內容</div>","pureAnnotationText":"註解內容"}--><!--被註解文字-->',
  })

  expect(wrapper.vm.splitContents).toEqual([
    { html: '一般文字 1', id: 0 },
    {
      annotation: '<div>註解內容 1</div>',
      id: 1,
      pureAnnotationText: '註解內容 1',
      text: '被註解文字 1',
    },
    {
      html: '一般文字 2',
      id: 2,
    },
    {
      annotation: '<div>註解內容 2</div>',
      id: 3,
      pureAnnotationText: '註解內容 2',
      text: '被註解文字 2',
    },
    {
      html: '一般文字 3',
      id: 4,
    },
  ])
})

test('should render correct content with correct order', () => {
  const wrapper = createWrapper(ContainerParagraphWithAnnotation, {
    propsData: {
      content:
        '<em>一般</em>文字<!--__ANNOTATION__={"text":"被註解文字","annotation":"<div>註解內容</div>","pureAnnotationText":"註解內容"}--><!--被註解文字-->',
    },
    slots: {
      default: '<div />',
    },
  })

  expect(
    wrapper.get('.paragraph-with-annotation *:first-child').html()
  ).toContain('<em>一般</em>文字')
  expect(
    wrapper.find('.paragraph-with-annotation *:nth-child(2)').exists()
  ).toBe(true)
})
