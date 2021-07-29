import UiMembershipButtonSecondary from './UiMembershipButtonSecondary.vue'

export default {
  component: UiMembershipButtonSecondary,
  title: 'Components/Membership/UiMembershipButtonSecondary',
}

const Template = (args, { argTypes }) => ({
  components: { UiMembershipButtonSecondary },
  props: Object.keys(argTypes),
  template: `<UiMembershipButtonSecondary v-bind="$props">{{ $props.slot }}</UiMembershipButtonSecondary>`,
})

export const defaultState = Template.bind({})
defaultState.args = {
  slot: 'mock button text',
}
