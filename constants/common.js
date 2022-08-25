/**
 *  @readonly
 *  @enum {string}
 */
const PaymentMethod = {
  NewebPay: 'newebpay',
  LINEPay: 'line_pay',
  GooglePay: 'google_play',
  AppStore: 'app_store',
}

/**
 *  @readonly
 *  @enum {string}
 */
const MemberType = {
  YearlyDisturbed: 'subscribe_yearly_disturb',
  MonthlyDisturbed: 'subscribe_monthly_disturb',
  Disturbed: 'disturb',
  MonthlyToYearly: 'subscribe_monthly_update_to_yearly',
  YearlyToMonthly: 'subscribe_yearly_update_to_monthly',
  Yearly: 'subscribe_yearly',
  Monthly: 'subscribe_monthly',
  OneTime: 'subscribe_one_time',
  Marketing: 'marketing',
  None: 'none',
}

/**
 *  @readonly
 *  @enum {string}
 */
const Frequency = {
  Marketing: 'marketing',
  Monthly: 'monthly',
  OneTime: 'one_time',
  OneTimeHyphen: 'one-time',
  Yearly: 'yearly',
}

export { PaymentMethod, MemberType, Frequency }
