import UiArticleIndex from '~/components/culture-post/UiArticleIndex.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $store: {
      state: {
        sections: {},
      },
    },
  },
  propsData: {
    currentIndex: 0,
    items: [],
  },
})

describe('hide-on-desktop class modifier on share div', function () {
  test('should append "hide-on-desktop" class modifier on share div if items is empty', function () {
    const wrapper = createWrapper(UiArticleIndex, {
      propsData: {
        items: [],
      },
    })
    const shareDiv = wrapper.get('.share')
    expect(shareDiv.classes()).toContain('share--hide-on-desktop')
  })
  test('should not append "hide-on-desktop" class modifier on share div if items is not empty', function () {
    const wrapper = createWrapper(UiArticleIndex, {
      propsData: {
        items: [{}],
      },
    })
    const shareDiv = wrapper.get('.share')
    expect(shareDiv.classes()).not.toContain('share--hide-on-desktop')
  })
})

describe('member section list', function () {
  test('should hide the member section list first list item if there is no section with the name "member" exist in store', function () {
    const wrapper = createWrapper(UiArticleIndex)
    expect(wrapper.find('.member-section-list__section').exists()).toBeFalsy()
  })
  test('should show the member section list first list item if there is the section with the name "member" exist in store', function () {
    const wrapper = createWrapper(UiArticleIndex, {
      mocks: {
        $store: {
          state: {
            sections: {
              data: {
                items: [
                  {
                    name: 'member',
                  },
                ],
              },
            },
          },
        },
      },
    })
    expect(wrapper.find('.member-section-list__section').exists()).toBeTruthy()
  })

  test('should show the proper section href and title', function () {
    const mockSectionMember = {
      name: 'member',
      title: 'mockTitle',
    }
    const wrapper = createWrapper(UiArticleIndex, {
      mocks: {
        $store: {
          state: {
            sections: {
              data: {
                items: [mockSectionMember],
              },
            },
          },
        },
      },
    })
    const title = wrapper.get('.section__title a')
    expect(title.attributes().href).toBe(`/section/${mockSectionMember.name}`)
    expect(title.text()).toBe(mockSectionMember.title)
  })
})

describe('member category list', function () {
  test('should show the proper category href and title', function () {
    const mockSectionMember = {
      name: 'member',
      title: 'mockTitle',
      categories: [
        {
          name: 'mockCategoryName1',
          title: 'mockCategoryTitle1',
        },
        {
          name: 'mockCategoryName2',
          title: 'mockCategoryTitle2',
        },
      ],
    }
    const wrapper = createWrapper(UiArticleIndex, {
      mocks: {
        $store: {
          state: {
            sections: {
              data: {
                items: [mockSectionMember],
              },
            },
          },
        },
      },
    })
    const memberCategoryListItems = wrapper.findAll(
      '.member-category-list__category'
    )
    memberCategoryListItems.wrappers.forEach(function assert(listItem, i) {
      const link = listItem.get('a')
      expect(link.attributes().href).toBe(
        `/category/${mockSectionMember.categories[i].name}`
      )
      expect(link.text()).toBe(mockSectionMember.categories[i].title)
    })
  })
})
