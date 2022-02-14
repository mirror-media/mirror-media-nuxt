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
  return plan[0]?.withShippingFee || merchandise
}

function merchandiseWithoutShippingFee(merchandise) {
  let plan
  PLAN_LIST.forEach((item) => {
    if (item.origin.code === merchandise.code) {
      plan = {
        ...item.origin,
        shippingFeePerCount: 0,
      }
    } else if (item.withShippingFee.code === merchandise.code) {
      console.log('fee', item.shippingFeePerCount)
      plan = {
        ...item.origin,
        shippingFeePerCount: item.shippingFeePerCount,
      }
    }
  })
  return plan
}

export { merchandiseWithShippingFee, merchandiseWithoutShippingFee }
