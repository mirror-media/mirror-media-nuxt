import { createLocalVue, mount } from '@vue/test-utils'
import Vuex from 'vuex'
import page from '~/pages/papermag/result'
import {
  getters as getterSubscribe,
  state as stateSubscribe,
} from '~/store/subscribe'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('customerInfo extract from orderInfo in subscribe store state', function () {
  let storeOptions
  const mockOrderInfo = {
    pur_name: 'mockPurName',
    pur_mail: 'mockPurEmail',
    pur_cell: 'mockPurCell',
    rec_name: 'mockRecName',
    rec_cell: 'mockRecCell',
    rec_addr: 'mockRecAddr',
  }
  beforeEach(() => {
    storeOptions = {
      modules: {
        subscribe: {
          namespaced: true,
          state: stateSubscribe(),
          getters: getterSubscribe,
        },
      },
    }
    storeOptions.modules.subscribe.state.orderInfo = mockOrderInfo
    storeOptions.modules.subscribe.state.resultStatus = 'success'
  })

  test('should display customerInfo extract from orderInfo in subscribe store state correctly', function () {
    const wrapper = mount(page, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    expect(wrapper.find('.pur_name').props().data).toBe(mockOrderInfo.pur_name)
    expect(wrapper.find('.pur_mail').props().data).toBe(mockOrderInfo.pur_mail)
    expect(wrapper.find('.pur_cell').props().data).toBe(mockOrderInfo.pur_cell)
    expect(wrapper.find('.rec_name').props().data).toBe(mockOrderInfo.rec_name)
    expect(wrapper.find('.rec_cell').props().data).toBe(mockOrderInfo.rec_cell)
    expect(wrapper.find('.rec_addr').props().data).toBe(mockOrderInfo.rec_addr)
  })
})

describe('orderId extract from infoPayload in subscribe store state', function () {
  let storeOptions
  const mockInfoPayload = {
    MerchantOrderNo: 'mockMerchantOrderNo',
  }
  beforeEach(() => {
    storeOptions = {
      modules: {
        subscribe: {
          namespaced: true,
          state: stateSubscribe(),
          getters: getterSubscribe,
        },
      },
    }
    storeOptions.modules.subscribe.state.infoPayload = mockInfoPayload
    storeOptions.modules.subscribe.state.resultStatus = 'success'
  })

  test('should display orderId extract from infoPayload in subscribe store state correctly', function () {
    const wrapper = mount(page, {
      localVue,
      store: new Vuex.Store(storeOptions),
    })
    expect(wrapper.find('.order-id').props().data).toBe(
      mockInfoPayload.MerchantOrderNo
    )
  })
})
