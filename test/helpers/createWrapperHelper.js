import { shallowMount } from '@vue/test-utils'
import _ from 'lodash'

/*
 ** lodash mergeWith customizer let us can override objValue with array or empty object
 ** see: https://lodash.com/docs/4.17.15#mergeWith
 */
const customizer = function (objValue, srcValue) {
  if (Array.isArray(srcValue)) {
    return srcValue
  }
  if (srcValue instanceof Object && Object.keys(srcValue).length === 0) {
    return srcValue
  }
}

const createWrapperHelper = function (defaultMountingOptions) {
  return function createWrapper(Component, overrideOptions) {
    return shallowMount(
      Component,
      _.mergeWith(
        _.cloneDeep(defaultMountingOptions),
        overrideOptions,
        customizer
      )
    )
  }
}

export default createWrapperHelper
