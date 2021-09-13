export default {
  id: `
    鏡週刊會員訂閱（由「未登入」且「未訂閱」狀態開始出發）。
    判斷式：
      若目前狀態為否則為紅字、
      若目前狀態為真則為綠字
  `,
  initial: '會員訂閱功能',

  context: {
    // true, false
    isLoggedIn: false,
    isTosAgreed: false,
    isEmailVerified: false,

    // null, 'post', '月訂閱', '年訂閱'
    subscription: null,

    // null, '解鎖這篇報導', '月訂閱', '年訂閱'
    subscriptionOrder: null,

    redirectDestination: undefined,

    isFromPost: false,
  },

  states: {
    會員訂閱功能: {
      id: '會員訂閱功能',
      initial: '起點',
      states: {
        起點: {
          on: {
            到會員文章頁: '會員文章頁',
            到方案購買頁: '方案購買流程',
            到付款紀錄頁: '付款紀錄頁',
            到付款設定頁: '付款設定頁',
            '到取消訂閱（原因詢問）頁': '取消訂閱（原因詢問）頁',
          },
        },
        referral: {
          id: 'referral',
          type: 'history',
        },
        會員文章頁: {
          id: '會員文章頁',
          initial: '起點',
          entry: ['navigateToPremiumPage'],
          exit: ['setFromPost'],
          states: {
            /*
             * '起點': {
             *   on: {
             *     '未登入': '未登入',
             *     '已登入': '已登入'
             *   }
             * },
             */
            起點: {
              on: {
                '': [
                  {
                    target: '已登入',
                    cond: '是否已登入',
                  },
                  {
                    target: '未登入',
                  },
                ],
              },
            },
            未登入: {
              on: {
                加入Premium會員: {
                  target: '#登入功能（獨立頁或 lightbox）',
                  actions: ['setRedirectToSub'],
                },
                解鎖這篇報導: {
                  target: '#登入功能（獨立頁或 lightbox）',
                  actions: ['orderSubscribe', 'setRedirectToForm'],
                },
                立即登入: {
                  target: '#登入功能（獨立頁或 lightbox）',

                  // actions: ['navigateToLoginPage'],
                },
              },
            },
            已登入: {
              id: '已登入',
              initial: '起點',
              states: {
                /*
                 * '起點': {
                 *   on: {
                 *     '未訂閱會員': '未訂閱',
                 *     '有解鎖本篇文章會員': '有解鎖本篇文章',
                 *     '月訂閱會員': '月訂閱',
                 *     '年訂閱會員': '年訂閱'
                 *   }
                 * },
                 */
                起點: {
                  on: {
                    '': [
                      {
                        target: '有解鎖本篇文章',
                        cond: '是單篇付款過的會員',
                      },
                      {
                        target: '月訂閱',
                        cond: '是月訂閱的會員',
                      },
                      {
                        target: '年訂閱',
                        cond: '是年訂閱的會員',
                      },
                      {
                        target: '未訂閱',
                      },
                    ],
                  },
                },
                未訂閱: {
                  on: {
                    加入Premium會員: '#方案購買流程',
                    解鎖這篇報導: {
                      target: '#方案購買流程',
                      actions: ['orderSubscribe'],
                    },
                  },
                },
                有解鎖本篇文章: {
                  type: 'final',
                },
                月訂閱: {
                  type: 'final',
                },
                年訂閱: {
                  type: 'final',
                },
              },
            },
          },
        },

        方案購買流程: {
          id: '方案購買流程',
          initial: '起點',
          states: {
            起點: {
              on: {
                '': [
                  {
                    target: '確認訂購頁',
                    cond: '是否已確認訂購方案',
                  },
                  {
                    target: '方案購買頁',
                  },
                ],
              },
            },
            方案購買頁: {
              id: '方案購買頁',
              initial: '起點',
              entry: ['navigateToSubscribePlans'],
              states: {
                /*
                 * '起點': {
                 *   on: {
                 *     '未登入': '未登入',
                 *     '已登入': '已登入'
                 *   }
                 * },
                 */
                起點: {
                  on: {
                    '': [
                      {
                        target: '已登入',
                        cond: '是否已登入',
                      },
                      {
                        target: '未登入',
                      },
                    ],
                  },
                },
                未登入: {
                  initial: '月或年方案選擇+加入會員',
                  states: {
                    '月或年方案選擇+加入會員': {
                      on: {
                        點擊免費加入會員: '#登入功能（獨立頁或 lightbox）',
                        月訂閱: {
                          target: '#登入功能（獨立頁或 lightbox）',
                          actions: ['orderSubscribe'],
                        },
                        年訂閱: {
                          target: '#登入功能（獨立頁或 lightbox）',
                          actions: ['orderSubscribe'],
                        },
                      },
                    },
                  },
                },
                已登入: {
                  initial: '起點',
                  states: {
                    /*
                     * '起點': {
                     *   on: {
                     *     '已登入（無購買紀錄）': '月或年方案選擇',
                     *     '已登入（只有單篇購買過））': '月或年方案選擇',
                     *     '已登入（已訂閱月方案）': '年方案選擇',
                     *     '已登入（已訂閱年方案）': '前往付款設定頁提示',
                     *   }
                     * },
                     */
                    起點: {
                      on: {
                        '': [
                          {
                            target: '月或年方案選擇',
                            cond: '是單篇付款過的會員',
                          },
                          {
                            target: '年方案選擇',
                            cond: '是月訂閱的會員',
                          },
                          {
                            target: '前往付款設定頁提示',
                            cond: '是年訂閱的會員',
                          },
                          {
                            target: '月或年方案選擇',
                          },
                        ],
                      },
                    },
                    月或年方案選擇: {
                      on: {
                        月訂閱: {
                          target: '#確認訂購頁',
                          actions: ['orderSubscribe'],
                        },
                        年訂閱: {
                          target: '#確認訂購頁',
                          actions: ['orderSubscribe'],
                        },
                      },
                    },
                    年方案選擇: {
                      on: {
                        年訂閱: {
                          target: '#確認訂購頁',
                          actions: ['orderSubscribe'],
                        },
                      },
                    },
                    前往付款設定頁提示: {
                      on: {
                        點擊前往付款設定頁: '#付款設定頁',
                      },
                    },
                  },
                },
              },
            },
            確認訂購頁: {
              id: '確認訂購頁',
              initial: '起點',
              states: {
                起點: {
                  on: {
                    '': [
                      {
                        target: '信箱驗證頁',
                        cond: '是否未驗證信箱',
                      },
                      {
                        target: '服務條款頁',
                        cond: '是否未同意服務條款',
                      },
                      {
                        target: '確認訂購表單頁',
                      },
                    ],
                  },
                },
                確認訂購表單頁: {
                  entry: ['navigateToSubscribeInfo'],
                  on: {
                    付款成功: {
                      target: '#付款成功頁',
                      actions: ['subscribe'],
                    },
                    付款失敗: '#付款失敗頁',
                  },
                },
                信箱驗證頁: {
                  id: '信箱驗證頁',
                  entry: ['navigateToEmailVerify'],
                  type: 'final',
                  on: {
                    假裝驗證信箱並繼續流程: undefined,
                  },
                },
                服務條款頁: {
                  id: '服務條款頁',
                  entry: ['navigateToServiceRule'],
                  on: {
                    同意服務條款並繼續: {
                      target: '起點',
                      actions: ['agreeTos'],
                    },
                  },
                },
              },
            },
            付款成功頁: {
              id: '付款成功頁',
              entry: ['navigateToSubscribeSuccess'],
              initial: '起點',
              states: {
                起點: {
                  on: {
                    '': [
                      {
                        target: '是從會員文章頁來的',
                        cond: '是否從會員文章頁來的',
                      },
                      {
                        target: '不是從會員文章頁來的',
                      },
                    ],
                  },
                },
                是從會員文章頁來的: {
                  on: {
                    回購買文章頁: '#會員文章頁',
                  },
                },
                不是從會員文章頁來的: {
                  type: 'final',

                  /*
                   * on: {
                   *   '瀏覽 Premium 會員文章': {
                   *     actions: ['navigateToSectionMember'],
                   *   },
                   *   回訂閱紀錄: '#付款紀錄頁',
                   * },
                   */
                },
              },

              /*
               * on: {
               *   點擊導引連結: [
               *     {
               *       target: '#會員文章頁',
               *       cond: '是否從會員文章頁來的',
               *     },
               *     {
               *       target: '#付款紀錄頁',
               *     },
               *   ],
               *   回訂閱紀錄: '#付款紀錄頁',
               * },
               */
            },
            付款失敗頁: {
              id: '付款失敗頁',
              entry: ['navigateToSubscribeFail'],
              on: {
                回前頁: '確認訂購頁',
              },
            },
          },
        },

        付款紀錄頁: {
          id: '付款紀錄頁',
          initial: '起點',
          entry: ['navigateToProfilePurchase'],
          states: {
            /*
             * '起點': {
             *   on: {
             *     '未登入': '#登入功能（獨立頁或 lightbox）',
             *     '已登入': '已登入'
             *   }
             * },
             */
            起點: {
              on: {
                '': [
                  {
                    target: '已登入',
                    cond: '是否已登入',
                  },
                  {
                    target: '#登入功能（獨立頁或 lightbox）',
                  },
                ],
              },
            },
            已登入: {
              initial: '起點',
              states: {
                起點: {
                  on: {
                    '': [
                      {
                        target: '已登入（只有單篇購買過）',
                        cond: '是單篇付款過的會員',
                      },
                      {
                        target: '已登入（已訂閱月方案）',
                        cond: '是月訂閱的會員',
                      },
                      {
                        target: '已登入（已訂閱年方案）',
                        cond: '是年訂閱的會員',
                      },
                      {
                        target: '已登入（已訂閱但取消下期）',
                        cond: '是訂閱但取消下期的會員',
                      },
                      {
                        target: '已登入（無購買紀錄）',
                      },
                    ],
                  },

                  /*
                   * on: {
                   *   '已登入（無購買紀錄）': '已登入（無購買紀錄）',
                   *   '已登入（只有單篇購買過）': '已登入（只有單篇購買過）',
                   *   '已登入（已訂閱月方案）': '已登入（已訂閱月方案）',
                   *   '已登入（已訂閱年方案）': '已登入（已訂閱年方案）'
                   * }
                   */
                },
                '已登入（無購買紀錄）': {
                  on: {
                    升級Premium會員: '#方案購買流程',
                  },
                },
                '已登入（只有單篇購買過）': {
                  on: {
                    升級Premium會員: '#方案購買流程',
                  },
                },
                '已登入（已訂閱月方案）': {
                  on: {
                    升級年訂閱: '#方案購買流程',
                    付款設定: '#付款設定頁',
                  },
                },
                '已登入（已訂閱但取消下期）': {
                  on: {
                    付款設定: '#付款設定頁',
                  },
                },

                /*
                 * '已登入（已訂閱月方案）': {
                 *   initial: '起點',
                 *   states: {
                 *     起點: {
                 *       on: {
                 *         年訂閱: {
                 *           name: '升級為年方案',
                 *           target: '升級年方案快速提示',
                 *           actions: ['orderSubscribe'],
                 *         },
                 *         付款設定: '#付款設定頁',
                 *       },
                 *     },
                 *     升級年方案快速提示: {
                 *       initial: '起點',
                 *       states: {
                 *         起點: {
                 *           on: {
                 *             確認升級: '升級中',
                 *           },
                 *         },
                 *         升級中: {
                 *           on: {
                 *             升級成功: {
                 *               target: '升級成功',
                 *               actions: ['subscribe'],
                 *             },
                 *             升級失敗: '升級失敗',
                 *           },
                 *         },
                 *         升級成功: {
                 *           on: {
                 *             回付款紀錄頁: '#付款紀錄頁',
                 *           },
                 *         },
                 *         升級失敗: {
                 *           on: {
                 *             返回: '起點',
                 *           },
                 *         },
                 *       },
                 *     },
                 *   },
                 * },
                 */
                '已登入（已訂閱年方案）': {
                  on: {
                    付款設定: '#付款設定頁',
                  },
                },
              },
            },
          },
        },

        付款設定頁: {
          id: '付款設定頁',
          initial: '起點',
          entry: ['navigateToSubscribeSet'],
          states: {
            /*
             * '起點': {
             *   on: {
             *     '未登入': '#登入功能（獨立頁或 lightbox）',
             *     '已登入': '已登入'
             *   }
             * },
             */
            起點: {
              on: {
                '': [
                  {
                    target: '已登入',
                    cond: '是否已登入',
                  },
                  {
                    target: '#登入功能（獨立頁或 lightbox）',
                  },
                ],
              },
            },
            已登入: {
              initial: '起點',
              states: {
                起點: {
                  on: {
                    '': [
                      {
                        target: '正處於月或年訂閱狀態',
                        cond: '是月訂閱的會員',
                      },
                      {
                        target: '正處於月或年訂閱狀態',
                        cond: '是年訂閱的會員',
                      },
                      {
                        target: '正處於月或年訂閱狀態',
                        cond: '是訂閱但取消下期的會員',
                      },
                      {
                        target: '#付款紀錄頁',
                      },
                    ],
                  },
                },
                正處於月或年訂閱狀態: {
                  on: {
                    '取消訂閱鏡週刊 Premium 服務': '#取消訂閱（原因詢問）頁',
                  },
                },
              },

              /*
               * on: {
               *   '取消訂閱鏡週刊 Premium 服務': '#取消訂閱（原因詢問）頁'
               * }
               */
            },
          },
        },

        '取消訂閱（原因詢問）頁': {
          id: '取消訂閱（原因詢問）頁',
          initial: '起點',
          entry: ['navigateToSubscribeCancelAsk'],
          states: {
            起點: {
              on: {
                '': [
                  {
                    target: '已登入',
                    cond: '是否已登入',
                  },
                  {
                    target: '#登入功能（獨立頁或 lightbox）',
                  },
                ],
              },

              /*
               * on: {
               *   '返回': '',
               *   '確認取消訂閱成功': '取消成功',
               *   '確認取消訂閱失敗': '取消失敗',
               * }
               */
            },
            已登入: {
              initial: '起點',
              states: {
                起點: {
                  on: {
                    '': [
                      {
                        target: '正處於訂閱狀態',
                        cond: '是月訂閱的會員',
                      },
                      {
                        target: '正處於訂閱狀態',
                        cond: '是年訂閱的會員',
                      },
                      {
                        target: '正處於訂閱狀態',
                        cond: '是訂閱但取消下期的會員',
                      },
                      {
                        target: '#付款紀錄頁',
                      },
                    ],
                    '是 app 訂閱的會員': '正處於 app 訂閱狀態',
                  },
                },
                正處於訂閱狀態: {
                  on: {
                    確認取消訂閱成功: {
                      target: '#取消訂閱（原因詢問）頁.取消成功',
                      actions: ['cancelSubscribe'],
                    },
                    確認取消訂閱失敗: '#取消訂閱（原因詢問）頁.取消失敗',
                  },
                },
                '正處於 app 訂閱狀態': {},
              },

              /*
               * on: {
               *   '取消訂閱鏡週刊 Premium 服務': '#取消訂閱（原因詢問）頁'
               * }
               */
            },
            取消成功: {
              entry: ['navigateToSubscribeCancelSuccess'],
              on: {
                回訂閱紀錄: '#付款紀錄頁',
              },
            },
            取消失敗: {
              entry: ['navigateToSubscribeCancelFail'],
              on: {
                回訂閱紀錄: '#付款紀錄頁',
              },
            },
          },
        },
      },
    },

    '登入功能（獨立頁或 lightbox）': {
      id: '登入功能（獨立頁或 lightbox）',
      initial: '登入表單',
      entry: ['navigateToLoginPage'],
      states: {
        登入表單: {
          on: {
            送出: '登入中',
          },
        },
        登入中: {
          on: {
            登入成功: {
              target: '登入成功頁',
              actions: ['login'],
            },
            登入失敗: '登入失敗頁',
          },
        },
        登入成功頁: {
          on: {
            自動跳轉: [
              {
                target: '#方案購買流程',
                cond: '訂購',
              },
              {
                target: '#方案購買流程',
                cond: '方案',
              },
              {
                target: '#referral',
                actions: ['navigateToPremiumPage'],
              },
            ],
          },
        },
        登入失敗頁: {
          on: {
            回上一頁: '登入表單',
          },
        },
      },
    },
  },
}
