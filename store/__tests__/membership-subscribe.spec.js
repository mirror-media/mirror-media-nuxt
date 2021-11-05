import { mapMemberTypeOfSubscribeGroupToMarketing } from '../membership-subscribe'

describe('mapMemberTypeOfSubscribeGroupToMarketing util function', function () {
  test('should map the value to marketing if the value of the type is subscribe_group', function () {
    const mockBasicInfo = {
      type: 'subscribe_group',
    }
    expect(mapMemberTypeOfSubscribeGroupToMarketing(mockBasicInfo).type).toBe(
      'marketing'
    )
  })
  test('should keep the original value if the key is not type, or the value of the type is not subscribe_group', function () {
    const mockBasicInfo = {
      type: 'not_subscribe_group',
      id: 'mock_id',
      otherKey: 'mock_other_value',
    }
    expect(mapMemberTypeOfSubscribeGroupToMarketing(mockBasicInfo)).toEqual(
      mockBasicInfo
    )
  })
})
