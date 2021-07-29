import UiSubscribeButton from './UiSubscribeButton.vue'

export default {
  component: UiSubscribeButton,
  title: 'Components/Subscribe/UiSubscribeButton',
}

const Template = (args, { argTypes }) => ({
  components: { UiSubscribeButton },
  props: Object.keys(argTypes),
  template: `<UiSubscribeButton v-bind="$props"/>`,
})

export const defaultState = Template.bind({})
defaultState.args = {
  title: 'mock title',
  hint: 'mock hint',
}
