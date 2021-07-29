import UiPremiumInviteToLogin from './UiPremiumInviteToLogin.vue'

export default {
  component: UiPremiumInviteToLogin,
  title: 'Components/Membership/UiPremiumInviteToLogin',
}

const Template = (args, { argTypes }) => ({
  components: { UiPremiumInviteToLogin },
  props: Object.keys(argTypes),
  template: `<UiPremiumInviteToLogin v-bind="$props"/>`,
})

export const defaultState = Template.bind({})
