import UiSubscribeButtonSmall from './UiSubscribeButtonSmall.vue'

export default {
  component: UiSubscribeButtonSmall,
  title: 'Components/Subscribe/UiSubscribeButtonSmall',
}

const Template = (args, { argTypes }) => ({
  components: { UiSubscribeButtonSmall },
  props: Object.keys(argTypes),
  template: `<UiSubscribeButtonSmall v-bind="$props"/>`,
})

export const defaultState = Template.bind({})
defaultState.args = {
  title: 'mock title',
}
