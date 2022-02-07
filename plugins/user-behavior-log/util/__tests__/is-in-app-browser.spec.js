// Inspired by https://github.com/f2etw/detect-inapp

import isInApp from '../is-in-app-browser'

const MOBILE = {
  IPHONE: {
    MESSENGER: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 [FBAN/MessengerForiOS;FBAV/117.0.0.36.70;FBBV/57539258;FBDV/iPhone7,2;FBMD/iPhone;FBSN/iOS;FBSV/10.2.1;FBSS/2;FBCR/&#20013-&#33775-&#38651-&#20449-;FBID/phone;FBLC/zh_TW;FBOP/5;FBRV/0]',
    ],
    FACEBOOK: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 [FBAN/FBIOS;FBAV/93.0.0.49.65;FBBV/58440824;FBDV/iPhone7,2;FBMD/iPhone;FBSN/iOS;FBSV/10.2.1;FBSS/2;FBCR/&#20013-&#33775-&#38651-&#20449-;FBID/phone;FBLC/zh_TW;FBOP/5;FBRV/0]',
    ],
    TWITTER: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14D27 Twitter for iPhone',
    ],
    LINE: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 Safari Line/7.3.2',
    ],
    INSTAGRAM: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 Instagram 10.21.0 (iPhone7,2; iOS 10_2_1; zh-Hant_JP; zh-Hant-JP; scale=2.00; gamut=normal; 750x1334)',
    ],
    WECHAT: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 MicroMessenger/6.5.8 NetType/WIFI Language/zh_CN',
    ],
  },
  SONY: {
    MESSENGER: [
      'Mozilla/5.0 (Linux; Android 6.0.1; D6653 Build/23.5.A.0.575; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 [FB_IAB/MESSENGER;FBAV/118.0.0.19.82;]',
    ],
    FACEBOOK: [
      'Mozilla/5.0 (Linux; Android 6.0.1; D6653 Build/23.5.A.0.575; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/124.0.0.22.66;]',
    ],
    LINE: [
      'Mozilla/5.0 (Linux; Android 6.0.1; D6653 Build/23.5.A.0.575; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 Line/7.4.0/IAB',
    ],
    INSTAGRAM: [
      'Mozilla/5.0 (Linux; Android 6.0.1; D6653 Build/23.5.A.0.575; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 Instagram 10.21.0 Android (23/6.0.1; 480dpi; 1080x1776; Sony; D6653; D6653; qcom; zh_TW)',
    ],
    WECHAT: [
      'Mozilla/5.0 (Linux; Android 6.0.1; D6653 Build/23.5.A.0.575; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 MicroMessenger/6.5.7.1041 NetType/WIFI Language/zh_TW',
    ],
  },
  HTC: {
    FACEBOOK: [],
    LINE: [],
    WECHAT: [],
    CHROME: [],
  },
  SAMSUNG: {
    MESSENGER: [
      'Mozilla/5.0 (Linux; Android 6.0.1; SM-N9208 Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 [FB_IAB/MESSENGER;FBAV/118.0.0.19.82;]',
    ],
    FACEBOOK: [
      'Mozilla/5.0 (Linux; Android 6.0.1; SM-N9208 Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/125.0.0.16.80;]',
    ],
    LINE: [
      'Mozilla/5.0 (Linux; Android 6.0.1; SM-N9208 Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 Line/7.4.0/IAB',
    ],
    WECHAT: [
      'Mozilla/5.0 (Linux; Android 6.0.1; SM-N9208 Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 MicroMessenger/6.5.7.1041 NetType/WIFI Language/zh_TW',
    ],
    INSTAGRAM: [
      'Mozilla/5.0 (Linux; Android 6.0.1; SM-N9208 Build/MMB29K; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 Instagram 10.22.0 Android (23/6.0.1; 560dpi; 1440x2560; samsung; SM-N9208; noblelte; samsungexynos7420; zh_TW)',
    ],
  },
  ASUS: {
    MESSENGER: [
      'Mozilla/5.0 (Linux; Android 4.4.2; ASUS_T00F Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36 [FB_IAB/MESSENGER;FBAV/118.0.0.19.82;]',
    ],
    FACEBOOK: [
      'Mozilla/5.0 (Linux; Android 4.4.2; ASUS_T00F Build/KVT49L) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36[FBAN/EMA;FBLC/zh_TW;FBAV/42.0.0.3.64;]',
    ],
  },
  REDMI: {
    MESSENGER: [
      'Mozilla/5.0 (Linux; Android 6.0.1; Redmi Note 3 Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 [FB_IAB/MESSENGER;FBAV/118.0.0.19.82;]',
    ],
    FACEBOOK: [
      'Mozilla/5.0 (Linux; Android 6.0.1; Redmi Note 3 Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/124.0.0.22.66;]',
    ],
    LINE: [
      'Mozilla/5.0 (Linux; Android 6.0.1; Redmi Note 3 Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 Line/7.4.0/IAB',
    ],
    INSTAGRAM: [
      'Mozilla/5.0 (Linux; Android 6.0.1; Redmi Note 3 Build/MMB29M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/58.0.3029.83 Mobile Safari/537.36 Instagram 10.21.0 Android (23/6.0.1; 480dpi; 1080x1920; Xiaomi; Redmi Note 3; kate; qcom; zh_TW)',
    ],
  },
  WINDOWS: {
    FACEBOOK: [],
    LINE: [],
    WECHAT: [],
  },
}

const TABLET = {
  IPAD: {
    MESSENGER: [
      'Mozilla/5.0 (iPad; CPU OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E304 [FBAN/MessengerForiOS;FBAV/117.0.0.36.70;FBBV/57539258;FBDV/iPad4,4;FBMD/iPad;FBSN/iOS;FBSV/10.3.1;FBSS/2;FBCR/;FBID/tablet;FBLC/zh_TW;FBOP/5;FBRV/0]',
    ],
    FACEBOOK: [
      'Mozilla/5.0 (iPad; CPU OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E304 [FBAN/FBIOS;FBAV/92.0.0.46.70;FBBV/57733420;FBDV/iPad4,4;FBMD/iPad;FBSN/iOS;FBSV/10.3.1;FBSS/2;FBCR/;FBID/tablet;FBLC/zh_TW;FBOP/5;FBRV/0]',
    ],
    TWITTER: [
      'Mozilla/5.0 (iPad; CPU OS 10_3_1 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14E304 Twitter for iPhone',
    ],
    LINE: [
      'Mozilla/5.0 (iPad; CPU OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E304 Safari Line/7.3.0',
    ],
    INSTAGRAM: [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E304 Instagram 10.20.0 (iPad4,4; iOS 10_3_1; zh_TW; zh-TW; scale=2.00; gamut=normal; 640x960)',
    ],
    WECHAT: [
      'Mozilla/5.0 (iPad; CPU OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E304 MicroMessenger/6.5.8 NetType/WIFI Language/zh_TW',
    ],
  },
}

test('isInApp function', function () {
  const devicesHasInAppBrowser = Object.assign({}, TABLET, MOBILE)
  Object.values(devicesHasInAppBrowser).forEach(function iterateEachDevice(
    device
  ) {
    Object.values(device).forEach(function iterateEachPlatform(platform) {
      platform.forEach(function assertIsInAppUA(useragent) {
        expect(isInApp(useragent)).toBe(true)
      })
    })
  })
})
