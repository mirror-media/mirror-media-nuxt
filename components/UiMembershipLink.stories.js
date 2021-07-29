import UiMembershipLink from './UiMembershipLink.vue'

export default {
  component: UiMembershipLink,
  title: 'Components/Membership/UiMembershipLink',
}

const Template = (args, { argTypes }) => ({
  components: { UiMembershipLink },
  props: Object.keys(argTypes),
  template: `<UiMembershipLink v-bind="$props">{{ $props.slot }}</UiMembershipLink>`,
})

export const defaultState = Template.bind({})
defaultState.args = {
  slot: 'mock link text',
}
