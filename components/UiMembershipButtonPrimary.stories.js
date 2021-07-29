import UiMembershipButtonPrimary from './UiMembershipButtonPrimary.vue'

export default {
  component: UiMembershipButtonPrimary,
  title: 'Components/Membership/UiMembershipButtonPrimary',
}

const Template = (args, { argTypes }) => ({
  components: { UiMembershipButtonPrimary },
  props: Object.keys(argTypes),
  template: `<UiMembershipButtonPrimary v-bind="$props">{{ $props.slot }}</UiMembershipButtonPrimary>`,
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
