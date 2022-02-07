const shippingFeePerYear = 1040
const PLAN_LIST = [
  {
    origin: {
      name: '一年鏡週刊 52 期',
      code: 'magazine_one_year',
    },
    withShippingFee: {
      name: '一年鏡週刊 52 期加掛號運費',
      code: 'magazine_one_year_with_shipping_fee',
    },
    shippingFeePerCount: shippingFeePerYear,
  },
  {
    origin: {
      name: '二年鏡週刊 104 期',
      code: 'magazine_two_year',
    },
    withShippingFee: {
      name: '一年鏡週刊 52 期加掛號運費',
      code: 'magazine_two_year_with_shipping_fee',
    },
    shippingFeePerCount: shippingFeePerYear * 2,
  },
]

function merchandiseWithShippingFee(merchandise) {
  const plan = PLAN_LIST.filter((item) => {
    return item.origin.code === merchandise.code
  })
  return plan.withShippingFee || merchandise
}

function merchandiseWithoutShippingFee(merchandise) {
  const plan = PLAN_LIST.filter((item) => {
    return item.withShippingFee.code === merchandise.code
  })
  if (plan.withShippingFee) {
    return {
      ...plan.withShippingFee,
      shippingFeePerCount: plan.shippingFeePerCount,
    }
  }
  return {
    ...merchandise,
    shippingFeePerCount: 0,
  }
}

export { merchandiseWithShippingFee, merchandiseWithoutShippingFee }
