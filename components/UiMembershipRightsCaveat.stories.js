import UiMembershipRightsCaveat from './UiMembershipRightsCaveat.vue'

export default {
  component: UiMembershipRightsCaveat,
  title: 'Components/Membership/UiMembershipRightsCaveat',
}

const Template = (args, { argTypes }) => ({
  components: { UiMembershipRightsCaveat },
  props: Object.keys(argTypes),
  template: `<UiMembershipRightsCaveat v-bind="$props"/>`,
})

export const defaultState = Template.bind({})
