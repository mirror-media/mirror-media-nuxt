import Header from '~/components/ContainerHeaderSectionMember.vue'
import createWrapperHelper from '~/test/helpers/createWrapperHelper'

const createWrapper = createWrapperHelper({
  mocks: {
    $store: {
      state: {
        sections: {},
      },
    },
  },
})

test('should emit "sidebarToggle" event when sidebar toggle button clicked', function () {
  const wrapper = createWrapper(Header)
  const button = wrapper.get('.sidebar-toggle-button')
  button.trigger('click')
  expect(wrapper.emitted().sidebarToggle).toBeTruthy()
})

describe('member section list', function () {
  test('should hide the member section list first list item if there is no section with the name "member" exist in store', function () {
    const wrapper = createWrapper(Header)
    expect(wrapper.find('.member-section-list__section').exists()).toBeFalsy()
  })
  test('should show the member section list first list item if there is the section with the name "member" exist in store', function () {
    const wrapper = createWrapper(Header, {
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
    const wrapper = createWrapper(Header, {
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
    const wrapper = createWrapper(Header, {
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
