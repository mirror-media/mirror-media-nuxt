import { createLocalVue, mount } from '@vue/test-utils'
import { directive as swiper } from 'vue-awesome-swiper'

import UiEditorChoices from '../UiEditorChoices.vue'
import UiArticleListAside from '../UiArticleListAside.vue'
import UiSlideshow from '../UiSlideshow.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper({
  propsData: {
    articles: [],
  },
  computed: {
    isDesktopWidth: () => false,
  },
})

test('display the content', () => {
  /* Arrange */
  const localVue = createLocalVue()
  localVue.directive('swiper', swiper)

  const articleMock = {
    slug: 'test-slug',
    title: 'test title',
    href: '/test-href/',
    imgSrc: 'test-img-src.png',
    imgSrcMobile: 'test-img-src-mobile.png',
    label: 'test label',
    sectionName: 'test-section-name',
  }
  const sut = mount(UiEditorChoices, {
    localVue,
    propsData: {
      articles: [articleMock],
    },
    computed: {
      isDesktopWidth: () => false,
    },
    stubs: ['UiArticleListAside'],
  })

  /* Assert */
  const articleList = sut.get('.editor-choices__article-list')
  const articleListText = articleList.text()

  expect(articleListText).toContain(articleMock.title)
  expect(articleList.get('a').attributes().href).toBe(articleMock.href)
  expect(articleList.get('img').attributes().src).toBe(articleMock.imgSrcMobile)
  expect(articleListText).toContain(articleMock.label)
  expect(articleList.get('.label').classes()).toContain(articleMock.sectionName)

  const slideshow = sut.get('.editor-choices__slideshow')
  const slideshowText = slideshow.text()

  expect(slideshowText).toContain(articleMock.title)
  expect(slideshow.get('a').attributes().href).toBe(articleMock.href)
  expect(slideshow.get('.swiper-slide img').attributes().src).toBe(
    articleMock.imgSrc
  )
})

test('pass articles to UiArticleListAside', () => {
  /* Arrange */
  const articlesMock = []
  const sut = createWrapper(UiEditorChoices, {
    propsData: {
      articles: articlesMock,
    },
  })

  /* Assert */
  expect(sut.getComponent(UiArticleListAside).props().items).toBe(articlesMock)
})

describe('slideshow', () => {
  test('the class name of the btnPrev slot is equal to options.navigation.prevEl, the class name of the btnNext slot is equal to options.navigation.nextEl, and the class name of the pagination slot is equal to options.pagination.el', () => {
    /* Arrange */
    const localVue = createLocalVue()
    localVue.directive('swiper', swiper)

    const sut = createWrapper(UiEditorChoices, {
      localVue,
    })

    /* Assert */
    const { navigation, pagination } = sut
      .getComponent(UiSlideshow)
      .props().options

    expect(sut.find(navigation.prevEl).exists()).toBe(true)
    expect(sut.find(navigation.nextEl).exists()).toBe(true)
    expect(sut.find(pagination.el).exists()).toBe(true)
  })

  test.todo(
    "initialize the slideshow when screens of users' devices are desktop width"
  )
})

describe('GA event', () => {
  test('emit a sendGa when users click an article', () => {
    /* Arrange */
    const localVue = createLocalVue()
    localVue.directive('swiper', swiper)

    const sut = mount(UiEditorChoices, {
      localVue,
      propsData: {
        articles: [{}],
      },
      computed: {
        isDesktopWidth: () => false,
      },
      stubs: ['UiArticleListAside'],
    })

    /* Act */
    sut.get('.editor-choices__article-list a').trigger('click')
    sut.get('.editor-choices__slideshow a').trigger('click')

    /* Assert */
    expect(sut.emitted().sendGa[0]).toBeTruthy()
    expect(sut.emitted().sendGa[1]).toBeTruthy()
  })

  test('emit a sendGa when UiArticleListAside emits a sendGa', () => {
    const sut = createWrapper(UiEditorChoices)

    sut.getComponent(UiArticleListAside).vm.$emit('sendGa')

    expect(sut.emitted().sendGa[0]).toBeTruthy()
  })
})
