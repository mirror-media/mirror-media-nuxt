import UiArticleBody from '../UiArticleBody.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'
import UiPremiumInviteToLogin from '~/components/UiPremiumInviteToLogin.vue'

const createWrapper = createWrapperHelper({
  propsData: {
    brief: [],
    content: [],
  },
  mocks: {
    $route: {
      name: '',
    },
    $config: {
      donateFeatureToggle: false,
    },
  },
})

describe('pageState props', function () {
  describe('premiumPageNotLogin', function () {
    const pageState = 'premiumPageNotLogin'
    test('should fade out the article body, show invite to login section', function () {
      const wrapper = createWrapper(UiArticleBody, {
        propsData: {
          pageState,
        },
      })
      expect(wrapper.get('.article-body').classes()).toContain(
        'article-body--fade-out-bottom'
      )
      expect(wrapper.findComponent(UiPremiumInviteToLogin).exists()).toBe(true)
    })

    test('should NOT show copyright warning and section of enter magazine page', function () {
      const wrapper = createWrapper(UiArticleBody, {
        propsData: {
          pageState,
        },
      })
      expect(wrapper.find('.copyright-warning').exists()).toBe(false)
      expect(wrapper.find('.magazine').exists()).toBe(false)
    })
  })

  describe('premiumPageIsLogin', function () {
    const pageState = 'premiumPageIsLogin'
    test('should NOT fade out the article body, show invite to login section', function () {
      const wrapper = createWrapper(UiArticleBody, {
        propsData: {
          pageState,
        },
      })
      expect(wrapper.get('.article-body').classes()).not.toContain(
        'article-body--fade-out-bottom'
      )
      expect(wrapper.findComponent(UiPremiumInviteToLogin).exists()).not.toBe(
        true
      )
    })

    test('should show copyright warning and section of enter magazine page', function () {
      const wrapper = createWrapper(UiArticleBody, {
        propsData: {
          pageState,
        },
      })
      expect(wrapper.find('.copyright-warning').exists()).not.toBe(false)
      expect(wrapper.find('.magazine').exists()).not.toBe(false)
    })
  })

  describe('storyPage', function () {
    const pageState = 'storyPage'
    test('should NOT fade out the article body, show invite to login section', function () {
      const wrapper = createWrapper(UiArticleBody, {
        propsData: {
          pageState,
        },
      })
      expect(wrapper.get('.article-body').classes()).not.toContain(
        'article-body--fade-out-bottom'
      )
      expect(wrapper.findComponent(UiPremiumInviteToLogin).exists()).not.toBe(
        true
      )
    })

    test('should NOT show copyright warning and section of enter magazine page', function () {
      const wrapper = createWrapper(UiArticleBody, {
        propsData: {
          pageState,
        },
      })
      expect(wrapper.find('.copyright-warning').exists()).toBe(false)
      expect(wrapper.find('.magazine').exists()).toBe(false)
    })
  })
})
