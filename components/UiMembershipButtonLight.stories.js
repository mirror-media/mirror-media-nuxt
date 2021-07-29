import UiMembershipButtonLight from './UiMembershipButtonLight.vue'

export default {
  component: UiMembershipButtonLight,
  title: 'Components/Membership/UiMembershipButtonLight',
}

const Template = (args, { argTypes }) => ({
  components: { UiMembershipButtonLight },
  props: Object.keys(argTypes),
  template: `<UiMembershipButtonLight v-bind="$props">{{ $props.slot }}</UiMembershipButtonLight>`,
})

export const defaultState = Template.bind({})
defaultState.args = {
  slot: 'mock button text',
}

export const disabledState = Template.bind({})
disabledState.args = {
  ...defaultState.args,
  disabled: true,
}
