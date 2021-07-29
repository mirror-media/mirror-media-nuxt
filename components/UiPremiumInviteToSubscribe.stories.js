import UiPremiumInviteToSubscribe from './UiPremiumInviteToSubscribe.vue'

export default {
  component: UiPremiumInviteToSubscribe,
  title: 'Components/Membership/UiPremiumInviteToSubscribe',
}

const Template = (args, { argTypes }) => ({
  components: { UiPremiumInviteToSubscribe },
  props: Object.keys(argTypes),
  template: `<UiPremiumInviteToSubscribe v-bind="$props"/>`,
})

export const defaultState = Template.bind({})
