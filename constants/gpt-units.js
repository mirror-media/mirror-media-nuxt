/**
 * 注意，下面這份 spreadsheet 有隱藏部分欄位，建議下載成 csv 檔查看
 * 資料來源：https://docs.google.com/spreadsheets/d/1PipyoWtAimAYie3pd7EOxxbCBpavF8wx-db3gHznMgI/edit?usp=sharing
 */

/**
 * page key（比如 global、57e1e0e5ee85930e00cad4e9）註解中各項文字代表的涵義：
 * // page key: spreadsheet 的「分類」欄位, spreadsheet 的「section」欄位 (鏡官網的 section name)
 */

/**
 * ad key（比如 RWD_LOGO、MB_HD）是怎麼決定的：spreadsheet 的「device」欄位_spreadsheet 的「position」欄位
 *
 * 構建 ad key 的程式碼如下：
 * const adKey = [
 *   device === 'm' ? 'MB' : device.toUpperCase(),
 *   position.toUpperCase(),
 * ].join('_')
 */
export default {
  // page key: 全站, ros
  global: {
    // ad key
    RWD_LOGO: {
      adUnit: 'mirror_RWD_ros_110x50_logo',
      adSize: [
        [95, 50],
        [1, 1],
      ],
    },
    MB_FS: {
      adUnit: 'mirror_m_ros_320x480_FS',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
    MB_AD2: {
      adUnit: 'mirror_m_ros_320x480_AD2',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
    MB_INNITY: {
      adUnit: 'mirror_m_ros_320x480_innity',
      adSize: [
        [320, 480],
        [1, 1],
      ],
    },
  },

  // page key: 首頁, hp
  home: {
    MB_HD: {
      adUnit: 'mirror_m_hp_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_L1: {
      adUnit: 'mirror_m_hp_300x250_L1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_L2: {
      adUnit: 'mirror_m_hp_300x250_L2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    PC_B1: {
      adUnit: 'mirror_pc_hp_728x90_B1',
      adSize: [
        [728, 90],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_hp_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 其他, oth
  other: {
    MB_HD: {
      adUnit: 'mirror_m_oth_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_oth_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_oth_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_oth_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_oth_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_oth_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_oth_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_oth_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_oth_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_oth_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_oth_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_oth_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_oth_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_oth_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 時事, news
  '57e1e0e5ee85930e00cad4e9': {
    MB_HD: {
      adUnit: 'mirror_m_news_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_news_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_news_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_news_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_news_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_news_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_news_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_news_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_news_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_news_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_news_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_news_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_news_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_news_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 娛樂, ent (entertainment)
  '57e1e11cee85930e00cad4ea': {
    MB_HD: {
      adUnit: 'mirror_m_ent_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_ent_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_ent_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_ent_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_ent_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_ent_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_ent_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_ent_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_ent_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_ent_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_ent_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_ent_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_ent_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_ent_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 財經理財, fin (businessmoney)
  '596441d04bbe120f002a319a': {
    MB_HD: {
      adUnit: 'mirror_m_fin_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_fin_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_fin_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_fin_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_fin_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_fin_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_fin_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_fin_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_fin_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_fin_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_fin_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_fin_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_fin_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_fin_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 人物, peo (people)
  '596441604bbe120f002a3197': {
    MB_HD: {
      adUnit: 'mirror_m_peo_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_peo_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_peo_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_peo_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_peo_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_peo_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_peo_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_peo_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_peo_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_peo_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_peo_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_peo_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_peo_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_peo_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 影音, video (videohub)
  videohub: {
    MB_HD: {
      adUnit: 'mirror_m_video_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_video_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_video_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_video_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_video_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_video_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_video_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 國際, int (international)
  '5964400d4bbe120f002a3191': {
    MB_HD: {
      adUnit: 'mirror_m_int_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_int_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_int_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_int_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_int_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_int_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_int_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_int_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_int_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_int_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_int_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_int_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_int_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_int_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 美食旅遊, tra (foodtravel)
  '57dfe399ee85930e00cad4d6': {
    MB_HD: {
      adUnit: 'mirror_m_tra_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_tra_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_tra_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_tra_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_tra_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_L1: {
      adUnit: 'mirror_m_tra_300x250_L1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_tra_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_tra_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_tra_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_tra_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_tra_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_tra_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_tra_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_tra_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_tra_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 瑪法達, mafa (mafalda)
  '5971aa8ce531830d00e32812': {
    MB_HD: {
      adUnit: 'mirror_m_mafa_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_mafa_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_mafa_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_mafa_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_mafa_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_mafa_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_mafa_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_mafa_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_mafa_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_mafa_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_mafa_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_mafa_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_mafa_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_mafa_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 文化, cul (culture)
  '5964418a4bbe120f002a3198': {
    MB_HD: {
      adUnit: 'mirror_m_cul_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_cul_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_cul_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_cul_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_cul_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_cul_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_cul_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_cul_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_cul_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_cul_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_cul_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_cul_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_cul_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_cul_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },

  // page key: 汽車鐘錶, wat (carandwatch)
  '57dfe3b0ee85930e00cad4d7': {
    MB_HD: {
      adUnit: 'mirror_m_wat_300x250_HD',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT1: {
      adUnit: 'mirror_m_wat_300x250_AT1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT2: {
      adUnit: 'mirror_m_wat_300x250_AT2',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_AT3: {
      adUnit: 'mirror_m_wat_300x250_AT3',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_E1: {
      adUnit: 'mirror_m_wat_300x250_E1',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_FT: {
      adUnit: 'mirror_m_wat_300x250_FT',
      adSize: [
        [336, 280],
        [300, 250],
        [320, 100],
        [1, 1],
      ],
    },
    MB_ST: {
      adUnit: 'mirror_m_wat_320x100_ST',
      adSize: [
        [320, 100],
        [320, 50],
        [1, 1],
      ],
    },
    PC_HD: {
      adUnit: 'mirror_pc_wat_970x250_HD',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
    PC_R1: {
      adUnit: 'mirror_pc_wat_300x250_R1',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_R2: {
      adUnit: 'mirror_pc_wat_300x600_R2',
      adSize: [
        [300, 600],
        [300, 250],
        [1, 1],
      ],
    },
    PC_FLOATING: {
      adUnit: 'mirror_pc_wat_200x200_floating',
      adSize: [
        [200, 200],
        [1, 1],
      ],
    },
    PC_AT1: {
      adUnit: 'mirror_pc_wat_640x390_AT1',
      adSize: [
        [640, 390],
        [468, 60],
        [1, 1],
      ],
    },
    PC_E1: {
      adUnit: 'mirror_pc_wat_300x250_E1',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_E2: {
      adUnit: 'mirror_pc_wat_300x250_E2',
      adSize: [
        [300, 250],
        [1, 1],
      ],
    },
    PC_FT: {
      adUnit: 'mirror_pc_wat_970x250_FT',
      adSize: [
        [970, 250],
        [970, 90],
        [1, 1],
      ],
    },
  },
}
