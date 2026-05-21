/**
 * 訂閱方案定價與文案集中管理
 */

const PLAN_YEARLY = {
  frequency: 'yearly',
  periods: 52,
  originalPrice: 2600,
  price: 1800,
  detail: '鏡週刊Premium會員（年方案）',
  priceLabel: '原價 NT$2600',
  buttonTitle: '訂閱年方案',
  buttonHint: '52期優惠$1800元',
  detailText: '年方案定價$2,600元，限時優惠$1,800',
}

const PLAN_HALFYEARLY = {
  frequency: 'halfyearly',
  periods: 26,
  originalPrice: 1300,
  price: 1000,
  detail: '鏡週刊Premium會員（半年方案）',
  priceLabel: '原價 NT$1300',
  buttonTitle: '訂閱半年方案',
  buttonHint: '26期優惠$1000元',
  detailText: '半年方案定價$1,300，搶購優惠$1,000',
}

const PLAN_ONE_TIME = {
  frequency: 'one_time',
  price: 10,
  detail: '鏡週刊Basic會員（單篇）',
}

export { PLAN_YEARLY, PLAN_HALFYEARLY, PLAN_ONE_TIME }
