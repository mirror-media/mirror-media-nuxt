import _ from 'lodash'

const gptUnits = {
  default: {
    // default
    APPHD: {
      aduid: 'mirror_APP_oth_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_oth_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_oth_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_oth_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_oth_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mm_mobile_other_ap_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mm_mobile_other_ap_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mm_mobile_other_ap_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_oth_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mm_mobile_other_ap_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mm_mobile_other_ap_320x100_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_oth_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT : position on listing page
    LMBHD: {
      aduid: 'mm_mobile_other_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mm_mobile_other_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    LMBL2: {
      aduid: 'mm_mobile_hp_300x250_L2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin-bottom: 35px;'],
    },
    LMBFT: {
      aduid: 'mm_mobile_other_ap_320x100_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'test_pc_np_ap_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCR1: {
      aduid: 'test_pc_np_ap_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'test_pc_np_ap_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mm_pc_other_ap_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'test_pc_np_ap_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'test_pc_np_ap_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'test_pc_np_ap_970x90_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mm_RWD_other_fluid_NA3',
      dimensions: '1x1,fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mm_RWD_other_fluid_NA5',
      dimensions: '1x1,fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mm_RWD_other_fluid_NA7',
      dimensions: '1x1,fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'test_pc_np_ap_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'test_pc_np_ap_970x90_FT',
      dimensions: '1x1,970x90,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCNA3: {
      aduid: 'mm_RWD_other_fluid_NA3',
      dimensions: '1x1,360x400,fluid',
      'cont-class': [
        'ad-container',
        'articleList-block',
        'nativeDFP',
        'margin-top-0',
      ],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mm_RWD_other_fluid_NA5',
      dimensions: '1x1,360x400,fluid',
      'cont-class': [
        'ad-container',
        'articleList-block',
        'nativeDFP',
        'margin-top-0',
      ],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mm_RWD_other_fluid_NA9',
      dimensions: '1x1,360x400,fluid',
      'cont-class': [
        'ad-container',
        'articleList-block',
        'nativeDFP',
        'margin-top-0',
      ],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LMBNA3: {
      aduid: 'mm_mobile_hp_fluid_NA3',
      dimensions: '1x1,360x400,fluid',
      'cont-class': [
        'ad-container',
        'articleList-block',
        'nativeDFP',
        'margin-top-0',
      ],
      'cont-style': [''],
    },
    LMBNA5: {
      aduid: 'mm_mobile_hp_fluid_NA5',
      dimensions: '1x1,360x400,fluid',
      'cont-class': [
        'ad-container',
        'articleList-block',
        'nativeDFP',
        'margin-top-0',
      ],
      'cont-style': [''],
    },
    LMBNA9: {
      aduid: 'mm_mobile_hp_fluid_NA9',
      dimensions: '1x1,360x400,fluid',
      'cont-class': [
        'ad-container',
        'articleList-block',
        'nativeDFP',
        'margin-top-0',
      ],
      'cont-style': [''],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
  },
  home: {
    //  homepage
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBHD: {
      aduid: 'mirror_m_hp_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 20px auto'],
    },
    LMBFS: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '320x480',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    LMBL1: {
      aduid: 'mirror_m_hp_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin-bottom: 35px;'],
    },
    LMBL2: {
      aduid: 'mirror_m_hp_300x250_L2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin-bottom: 35px;'],
    },
    // 'LMBFT': { 'aduid': 'mm_mobile_hp_320x100_FT', 'dimensions': '1x1,300x250,320x100,336x280', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin-top: 20px' ] },
    LMBNA3: {
      aduid: 'mirror_m_hp_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'articleList-block', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBNA5: {
      aduid: 'mirror_m_hp_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'articleList-block', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBNA9: {
      aduid: 'mirror_m_hp_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'articleList-block', 'margin-top-0'],
      'cont-style': [''],
    },
    LPCHD: {
      aduid: 'mirror_pc_hp_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['margin-bottom: 20px !important'],
    },
    LPCB1: {
      aduid: 'mirror_pc_hp_728x90_B1',
      dimensions: '728x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // 'LPCFT': { 'aduid': 'mm_pc_hp_970x90_FT', 'dimensions': '1x1,970x90', 'cont-class': [ 'ad-container' ], 'cont-style': [ 'margin-top: 20px' ] },
    LPCNA3: {
      aduid: 'mirror_pc_hp_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'articleList-block', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_pc_hp_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'articleList-block', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_pc_hp_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'articleList-block', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // 'LMBCVR-VPON': { 'aduid': 'mirror_m_ros_320x480_OOP', 'dimensions': '0x0', 'cont-class': [ 'ad-container' ], 'cont-style': [ '' ], outOfPage: true },
    // 'OOP': { 'aduid': 'test_mirror_rwd_peo_fluid_na3', 'dimensions': '', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ], 'outOfPage': true }
    // 'OOP': { 'aduid': 'mirror_pc_peo_640x390_AT1', 'dimensions': '', 'cont-class': [ 'ad-container', 'margin-top-0' ], 'cont-style': [ '' ], 'outOfPage': true },
  },
  other: {
    //  topic

    SMBHD: {
      aduid: 'mirror_m_wat_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    SMBL1: {
      aduid: 'mirror_m_wat_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    SMBL2: {
      aduid: 'mirror_m_wat_300x250_L2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    SMBL3: {
      aduid: 'mirror_m_wat_300x250_L3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin-bottom: 20px'],
    },
    SMBFT: {
      aduid: 'mirror_m_wat_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin-bottom: 10px'],
    },
    // SPCHD, SPCR1, SPCR2, SPCR3, SPCR4, SPCFT : position on desktop section page
    SPCHD: {
      aduid: 'mirror_pc_wat_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 20px auto 0'],
    },
    SPCR1: {
      aduid: 'mirror_pc_wat_300x250_R1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': [''],
    },
    SPCR2: {
      aduid: 'mirror_pc_wat_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': [''],
    },
    SPCR3: {
      aduid: 'mirror_pc_wat_300x250_R3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': ['margin-bottom: 10px'],
    },
    SPCR4: {
      aduid: 'mirror_pc_wat_300x600_R4',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': [''],
    },
    SPCFT: {
      aduid: 'mirror_pc_wat_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['margin-bottom: 35px'],
    },

    // MBHD, MBAR1, MBAR2, MBE1, MBFT : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_oth_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_oth_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_oth_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_oth_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_oth_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_oth_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_oth_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBHD: {
      aduid: 'mirror_m_oth_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_oth_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_oth_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_oth_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCR1: {
      aduid: 'mirror_pc_oth_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_oth_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_oth_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_oth_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_oth_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_oth_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_oth_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_oth_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_oth_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },

    LPCHD: {
      aduid: 'mirror_pc_oth_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'mirror_pc_oth_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 20px auto 0'],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_oth_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_oth_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_oth_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_oth_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_oth_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_oth_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_oth_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_oth_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
  '57e1e0e5ee85930e00cad4e9': {
    // news-people
    APPHD: {
      aduid: 'mirror_APP_news_300x250_HD',
      dimensions: '300x250',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_news_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_news_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_news_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_news_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_news_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_news_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_news_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_news_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_news_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_news_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_news_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT
    LMBHD: {
      aduid: 'mirror_m_news_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_news_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_news_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_news_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
      'size-mapping': 'default',
    },
    PCR1: {
      aduid: 'mirror_pc_news_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_news_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_news_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_news_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_news_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_news_970x250_FT',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_news_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_news_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_news_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_news_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'mirror_pc_news_970x250_FT',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_news_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_news_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_news_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_news_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_news_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_news_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_news_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_news_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
  '596441d04bbe120f002a319a': {
    // businessmoney
    APPHD: {
      aduid: 'mirror_APP_fin_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_fin_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_fin_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_fin_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_fin_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_fin_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_fin_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_fin_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_fin_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_fin_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_fin_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_fin_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT
    LMBHD: {
      aduid: 'mirror_m_fin_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_fin_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_fin_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_fin_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
      'size-mapping': 'default',
    },
    PCR1: {
      aduid: 'mirror_pc_fin_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_fin_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_fin_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_fin_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_fin_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_fin_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_fin_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_fin_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_fin_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_fin_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'mirror_pc_fin_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_fin_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_fin_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_fin_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_fin_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_fin_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_fin_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_fin_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_fin_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
  '5964418a4bbe120f002a3198': {
    // culture
    APPHD: {
      aduid: 'mirror_APP_cul_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_cul_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_cul_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_cul_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_cul_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_cul_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_cul_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_cul_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_cul_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_cul_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_cul_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_cul_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT
    LMBHD: {
      aduid: 'mirror_m_cul_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_cul_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_cul_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_cul_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
      'size-mapping': 'default',
    },
    PCR1: {
      aduid: 'mirror_pc_cul_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_cul_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_cul_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_cul_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_cul_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_cul_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_cul_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_cul_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_cul_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_cul_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'mirror_pc_cul_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_cul_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_cul_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_cul_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_cul_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_cul_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_cul_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_cul_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_cul_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
  '5971aa8ce531830d00e32812': {
    // mafalda
    APPHD: {
      aduid: 'mirror_APP_mafa_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_mafa_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_mafa_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_mafa_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_mafa_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_mafa_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_mafa_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_mafa_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_mafa_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_mafa_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_mafa_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_mafa_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT
    LMBHD: {
      aduid: 'mirror_m_mafa_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_mafa_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_mafa_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_mafa_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
      'size-mapping': 'default',
    },
    PCR1: {
      aduid: 'mirror_pc_mafa_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_mafa_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_mafa_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_mafa_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_mafa_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_mafa_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_mafa_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_mafa_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_mafa_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_mafa_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'mirror_pc_mafa_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_mafa_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_mafa_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_mafa_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_mafa_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_mafa_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_mafa_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_mafa_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_mafa_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
  '5975ab2de531830d00e32b2f': {
    // videohub
    APPHD: {
      aduid: 'mirror_APP_oth_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_oth_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_oth_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_oth_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_oth_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_video_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_oth_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_oth_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_video_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_video_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_video_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT
    LMBHD: {
      aduid: 'mirror_m_video_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_oth_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_video_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_video_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    PCR1: {
      aduid: 'mirror_pc_video_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_oth_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_oth_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_oth_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_oth_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_video_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_oth_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_oth_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_oth_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_video_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    LPCFT: {
      aduid: 'mirror_pc_video_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_oth_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_oth_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_oth_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
  },
  '5964400d4bbe120f002a3191': {
    // international
    APPHD: {
      aduid: 'mirror_APP_int_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_int_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_int_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_int_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_int_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_int_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_int_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_int_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_int_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_int_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_int_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_int_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT
    LMBHD: {
      aduid: 'mirror_m_int_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_int_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_int_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_int_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
      'size-mapping': 'default',
    },
    PCR1: {
      aduid: 'mirror_pc_int_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_int_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_int_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_int_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_int_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_int_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_int_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_int_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_int_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_int_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'mirror_pc_int_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_int_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_int_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_int_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_int_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_int_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_int_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_int_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_int_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
  '596441604bbe120f002a3197': {
    // people
    APPHD: {
      aduid: 'mirror_APP_peo_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_peo_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_peo_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_peo_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_peo_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_peo_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_peo_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_peo_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_peo_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_peo_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_peo_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_peo_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT
    LMBHD: {
      aduid: 'mirror_m_peo_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_peo_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_peo_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_peo_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
      'size-mapping': 'default',
    },
    PCR1: {
      aduid: 'mirror_pc_peo_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_peo_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_peo_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCAROOP: {
      aduid: 'mirror_pc_peo_640x390_AT1',
      dimensions: '1x1,640x390',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': ['clear: both'],
      outOfPage: true,
    },
    PCE1: {
      aduid: 'mirror_pc_peo_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_peo_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_peo_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_peo_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_peo_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_peo_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_peo_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'mirror_pc_peo_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_peo_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_peo_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_peo_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_peo_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_peo_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_peo_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_peo_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_peo_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
  '57e1e11cee85930e00cad4ea': {
    // entertainment
    APPHD: {
      aduid: 'mirror_APP_ent_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_ent_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_ent_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_ent_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_ent_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_ent_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_ent_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_ent_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_ent_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_ent_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_ent_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_ent_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT : position on listing page
    LMBHD: {
      aduid: 'mirror_m_ent_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_ent_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_ent_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_ent_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCR1: {
      aduid: 'mirror_pc_ent_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_ent_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_ent_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_ent_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_ent_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_ent_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_ent_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_ent_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_ent_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_ent_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'mirror_pc_ent_970x250_FT',
      dimensions: '1x1,970x90,970x250',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_ent_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_ent_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_ent_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_ent_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_ent_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_ent_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_ent_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_ent_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
  '57dfe399ee85930e00cad4d6': {
    // food-travel
    APPHD: {
      aduid: 'mirror_APP_tra_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_tra_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_tra_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_tra_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_tra_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_tra_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_tra_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_tra_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_tra_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_tra_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_tra_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_tra_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT : position on listing page
    LMBHD: {
      aduid: 'mirror_m_tra_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_tra_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0'],
    },
    LMBSL1: {
      aduid: 'mirror_m_tra_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 20px 0'],
    },
    LMBFT: {
      aduid: 'mirror_m_tra_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 20px 0'],
    },
    LMBSFT: {
      aduid: 'mirror_m_tra_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_tra_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCR1: {
      aduid: 'mirror_pc_tra_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_tra_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_tra_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_tra_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_tra_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_tra_970x250_FT',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_tra_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_tra_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_tra_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_tra_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCFT: {
      aduid: 'mirror_pc_tra_970x250_FT',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCSFT: {
      aduid: 'mirror_pc_tra_970x250_FT',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 20px auto'],
    },
    // 'LPCR1': { 'aduid': 'mm_pc_fnt_300x600_R1', 'dimensions': '1x1,300x250,300x600', 'cont-class': [ 'ad-container', 'center' ], 'cont-style': [ '' ] },
    LPCSR1: {
      aduid: 'mirror_pc_tra_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_tra_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_tra_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_tra_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_tra_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_tra_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_tra_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_tra_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_tra_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
  '57dfe3b0ee85930e00cad4d7': {
    // watch
    APPHD: {
      aduid: 'mirror_APP_wat_300x250_HD',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    APPAT1: {
      aduid: 'mirror_APP_wat_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPAT2: {
      aduid: 'mirror_APP_wat_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPE1: {
      aduid: 'mirror_APP_wat_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0', 'center'],
      'cont-style': [''],
    },
    APPFT: {
      aduid: 'mirror_APP_wat_300x250_FT',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    APPST: {
      aduid: 'mirror_APP_ros_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // -- Section Page
    // SMBHD, SMBL1, SMBL2, SMBL3, SMBFT : position on mobile section page
    SMBHD: {
      aduid: 'mirror_m_wat_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    SMBL1: {
      aduid: 'mirror_m_wat_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    SMBL2: {
      aduid: 'mirror_m_wat_300x250_L2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    SMBL3: {
      aduid: 'mirror_m_wat_300x250_L3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin-bottom: 20px'],
    },
    SMBFT: {
      aduid: 'mirror_m_wat_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin-bottom: 10px'],
    },
    // SPCHD, SPCR1, SPCR2, SPCR3, SPCR4, SPCFT : position on desktop section page
    SPCHD: {
      aduid: 'mirror_pc_wat_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    SPCR1: {
      aduid: 'mirror_pc_wat_300x250_R1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': [''],
    },
    SPCR2: {
      aduid: 'mirror_pc_wat_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': [''],
    },
    SPCR3: {
      aduid: 'mirror_pc_wat_300x250_R3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': ['margin-bottom: 10px'],
    },
    SPCR4: {
      aduid: 'mirror_pc_wat_300x600_R4',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': [''],
    },
    SPCFT: {
      aduid: 'mirror_pc_wat_970x250_FT',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['margin-bottom: 35px'],
    },
    // -- Category, Article Page
    // MBHD, MBAR1, MBAR2, MBE1, MBFT, MBCVR : position on mobile article page
    MBHD: {
      aduid: 'mirror_m_wat_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    MBAR1: {
      aduid: 'mirror_m_wat_300x250_AT1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR2: {
      aduid: 'mirror_m_wat_300x250_AT2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBAR3: {
      aduid: 'mirror_m_wat_300x250_AT3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [
        'margin-left: auto',
        'margin-right: auto',
        'line-height: default',
      ],
    },
    MBE1: {
      aduid: 'mirror_m_wat_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBFT: {
      aduid: 'mirror_m_wat_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    MBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    MBST: {
      aduid: 'mirror_m_wat_320x100_ST',
      dimensions: '1x1,320x50,320x100',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // MBHD, MBL1, MBFT : position on listing page
    LMBHD: {
      aduid: 'mirror_m_wat_300x250_HD',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin: 0 auto', 'padding: 20px 0'],
    },
    LMBL1: {
      aduid: 'mirror_m_wat_300x250_L1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    LMBL2: {
      aduid: 'mirror_m_wat_300x250_L2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    LMBL3: {
      aduid: 'mirror_m_wat_300x250_L3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container'],
      'cont-style': ['margin-bottom: 20px'],
    },
    LMBFT: {
      aduid: 'mirror_m_wat_300x250_FT',
      dimensions: '1x1,300x250,320x100,336x280',
      'cont-class': ['ad-container', 'center'],
      'cont-style': ['margin-bottom: 10px'],
    },
    LMBCVR: {
      aduid: 'mirror_m_ros_320x480_FS',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR2: {
      aduid: 'mirror_m_ros_320x480_AD2',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    LMBCVR3: {
      aduid: 'mirror_m_ros_320x480_innity',
      dimensions: '1x1,320x480,320x100,320x50',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCHD, PCR1, PCR2, PCAR, PCE1, PCE2, PCFT : position on article page
    PCHD: {
      aduid: 'mirror_pc_wat_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCR1: {
      aduid: 'mirror_pc_wat_300x250_R1',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2: {
      aduid: 'mirror_pc_wat_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCR2B: {
      aduid: 'mirror_pc_ros_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center'],
      'cont-style': [''],
    },
    PCAR: {
      aduid: 'mirror_pc_wat_640x390_AT1',
      dimensions: '1x1,468x60,640x390',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['clear: both', 'margin: 0 auto'],
    },
    PCE1: {
      aduid: 'mirror_pc_wat_300x250_E1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCE2: {
      aduid: 'mirror_pc_wat_300x250_E2',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    PCFT: {
      aduid: 'mirror_pc_wat_970x250_FT',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    PCFF: {
      aduid: 'mirror_pc_wat_200x200_floating',
      dimensions: '1x1,200x200',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': [''],
    },
    // PCPOP1, PCPOP2, PCPOP3 : position in poplist
    PCPOP3: {
      aduid: 'mirror_RWD_wat_fluid_NA3_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP5: {
      aduid: 'mirror_RWD_wat_fluid_NA5_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    PCPOP7: {
      aduid: 'mirror_RWD_wat_fluid_NA7_ap',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // SPCHD, SPCFT : position on listing page
    LPCHD: {
      aduid: 'mirror_pc_wat_970x250_HD',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container'],
      'cont-style': ['width: 970px', 'margin: 0 auto', 'padding: 20px 0'],
    },
    LPCR1: {
      aduid: 'mirror_pc_wat_300x250_R1',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': [''],
    },
    LPCR2: {
      aduid: 'mirror_pc_wat_300x600_R2',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': [''],
    },
    LPCR3: {
      aduid: 'mirror_pc_wat_300x250_R3',
      dimensions: '1x1,300x250,336x280',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': ['margin-bottom: 10px'],
    },
    LPCR4: {
      aduid: 'mirror_pc_wat_300x600_R4',
      dimensions: '1x1,300x250,300x600',
      'cont-class': ['ad-container', 'center', 'margin-top-0'],
      'cont-style': [''],
    },
    LPCFT: {
      aduid: 'mirror_pc_wat_970x250_FT',
      dimensions: '1x1,970x250,970x90',
      'cont-class': ['ad-container', 'margin-top-0'],
      'cont-style': ['margin: 0 auto 40px'],
    },
    LPCNA3: {
      aduid: 'mirror_RWD_wat_fluid_NA3',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA5: {
      aduid: 'mirror_RWD_wat_fluid_NA5',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    LPCNA9: {
      aduid: 'mirror_RWD_wat_fluid_NA9',
      dimensions: 'fluid',
      'cont-class': ['ad-container', 'nativeDFP', 'margin-top-0'],
      'cont-style': ['background-color: #f4f1e9'],
    },
    // LOGO : position on header
    LOGO: {
      aduid: 'mirror_RWD_ros_110x50_logo',
      dimensions: '95x50',
      'cont-class': ['ad-container'],
      'cont-style': [''],
    },
    // AMP ads
    AMP: {
      AMPHD: {
        aduid: 'mirror_AMP_wat_300x250_HD',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPFT: {
        aduid: 'mirror_AMP_wat_300x250_FT',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT1: {
        aduid: 'mirror_AMP_wat_300x250_AT1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPAT2: {
        aduid: 'mirror_AMP_wat_300x250_AT2',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
      },
      AMPE1: {
        aduid: 'mirror_AMP_wat_300x250_E1',
        dimensions: { width: 336, height: 280 },
        multiSize: '300x250',
        showAfterRelatedPost: 7,
      },
      AMPST: {
        aduid: 'mirror_AMP_ros_320x100_ST',
        dimensions: { width: 320, height: 100 },
      },
    },
  },
}

function transformLegacyGPTUnit({ aduid = '', dimensions } = {}) {
  return {
    adUnitCode: aduid,
    adSize: transformLegacyDimensions(dimensions),
  }

  function transformLegacyDimensions(dimensions) {
    if (!dimensions) {
      return []
    }

    if (typeof dimensions === 'string' && dimensions.includes('fluid')) {
      return ['fluid']
    } else if (typeof dimensions === 'string') {
      const sizes = dimensions.split(',')
      return sizes.map(function transformToWidthHeightArray(sizeStringWithX) {
        return sizeStringWithX.split('x').map((value) => parseInt(value))
      })
    } else if (
      Object.prototype.hasOwnProperty.call(dimensions, 'width') &&
      Object.prototype.hasOwnProperty.call(dimensions, 'height')
    ) {
      return [dimensions.width, dimensions.height]
    }
  }
}

/**
 * Example input:
 * {
 *   sectionId: {
 *     AMP: {
 *       AMP_ADUNIT: {
 *         aduid: 'ad'
 *         dimensions: '1x1,970x280,300x250',
 *         'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
 *         'cont-style': ['background-color: #f4f1e9']
 *       }
 *     }
 *     ADUNIT: {
 *       aduid: 'ad'
 *       dimensions: '1x1,970x280,300x250',
 *       'cont-class': ['ad-container', 'pop_item', 'margin-top-0'],
 *       'cont-style': ['background-color: #f4f1e9']
 *     }
 *   }
 * }
 *
 * Example output:
 * {
 *   sectionId: {
 *     AMP: {
 *       AMP_ADUNIT: {
 *         adUnitCode: 'ad'
 *         adSize: [[1, 1], [970, 250], [300, 250]],
 *       }
 *     }
 *     ADUNIT: {
 *       adUnitCode: 'ad'
 *       adSize: [[1, 1], [970, 250], [300, 250]],
 *     }
 *   }
 * }
 */
export default _.mapValues(gptUnits, function (units) {
  return _.mapValues(units, function (value, key) {
    if (key === 'AMP') {
      return _.mapValues(value, transformLegacyGPTUnit)
    }
    return transformLegacyGPTUnit(value)
  })
})
