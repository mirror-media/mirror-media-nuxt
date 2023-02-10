import CulturePost from '../ContainerCulturePost.vue'
import UiWineWarning from '~/components/UiWineWarning.vue'

import createWrapperHelper from '~/test/helpers/createWrapperHelper.js'

const createWrapper = createWrapperHelper({
  propsData: {
    story: {},
  },
  mocks: {
    $route: {
      name: 'premium-slug',
    },
    $store: {
      getters: {
        'viewport/isViewportWidthUpXl': false,
      },
    },
    $config: {
      donateFeatureToggle: false,
    },
  },
})

test('show the wine warning when the category name of a story has "wine"', function () {
  const sut = createWrapper(CulturePost, {
    propsData: {
      story: {
        categories: [{ name: 'wine' }],
      },
    },
  })

  expect(sut.findComponent(UiWineWarning).exists()).toBe(true)
})
