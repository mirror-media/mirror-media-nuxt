import UiPremiumLoginNow from './UiPremiumLoginNow.vue'

export default {
  component: UiPremiumLoginNow,
  title: 'Components/Membership/UiPremiumLoginNow',
}

const Template = (args, { argTypes }) => ({
  components: { UiPremiumLoginNow },
  props: Object.keys(argTypes),
  template: `<UiPremiumLoginNow v-bind="$props"/>`,
})

export const defaultState = Template.bind({})
