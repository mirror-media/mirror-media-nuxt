import UiSubscribeCountButton from './UiSubscribeCountButton.vue'

export default {
  component: UiSubscribeCountButton,
  title: 'Components/Subscribe/UiSubscribeCountButton',
}

const Template = (args, { argTypes }) => ({
  components: { UiSubscribeCountButton },
  props: Object.keys(argTypes),
  template: `<UiSubscribeCountButton v-bind="$props"/>`,
})

export const defaultState = Template.bind({})

export const typePropsIsIncrease = Template.bind({})
typePropsIsIncrease.args = {
  type: 'increase',
}

export const isDisablePropsIsTrue = Template.bind({})
isDisablePropsIsTrue.args = {
  isDisable: true,
}
