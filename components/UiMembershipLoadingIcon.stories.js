import { themes } from '@storybook/theming'
import UiMembershipLoadingIcon from './UiMembershipLoadingIcon.vue'

export default {
  component: UiMembershipLoadingIcon,
  title: 'Components/Membership/UiMembershipLoadingIcon',
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#333333' }],
    },
    docs: {
      theme: themes.dark,
    },
  },
}

const Template = (args, { argTypes }) => ({
  components: { UiMembershipLoadingIcon },
  props: Object.keys(argTypes),
  template: `<UiMembershipLoadingIcon v-bind="$props"/>`,
})

export const defaultState = Template.bind({})
