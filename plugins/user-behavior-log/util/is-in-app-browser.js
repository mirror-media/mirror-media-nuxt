// Inspired by https://github.com/f2etw/detect-inapp

export default function isInApp(useragent) {
  const rules = [
    'WebView',
    '(iPhone|iPod|iPad)(?!.*Safari/)',
    'Android.*(wv|.0.0.0)',
  ]
  const regex = new RegExp(`(${rules.join('|')})`, 'ig')
  return Boolean(useragent.match(regex))
}
