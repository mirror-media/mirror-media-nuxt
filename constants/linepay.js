const RETURN_CODE = {
  SUCCESS: '0000',

  /*
   * A record of transaction with the same order number already exists.
   * It occurs when calling the same API again after the transaction is completed.
   */
  ORDER_NUMBER_DUPLICATED: '1172',

  /*
   * Call the same API multiple times in short period.
   * It occurs when calling them same API before the transaction is completed.
   * It indicates that transaction is processing.
   */
  API_CALL_DUPLICATED: '1198',
}

export { RETURN_CODE }
