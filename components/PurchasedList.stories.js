import PurchasedList from './PurchasedList.vue'

export default {
  component: PurchasedList,
  title: 'Components/Subscribe/PurchasedList',
}

const Template = (args, { argTypes }) => ({
  components: { PurchasedList },
  props: Object.keys(argTypes),
  template: '<PurchasedList v-bind="$props" />',
})

export const defaultValueOfDataProps = Template.bind({})
export const passingValueToDataProps = Template.bind({})
passingValueToDataProps.args = {
  data: [
    {
      text: '第一個項目',
      price: 1000,
    },
    {
      text: '第二個項目',
      price: 2000,
      hints: ['第二個項目的第一個提示', '第二個項目的第二個提示'],
    },
  ],
}
