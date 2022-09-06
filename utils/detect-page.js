export const pageNames = [
  'author',
  'category',
  'external',
  'externals',
  'magazine',
  'papermag',
  'pre',
  'premium',
  'premiumcategory',
  'premiumsection',
  'profile',
  'search',
  'section',
  'story',
  'subscribe',
  'tag',
  'topic',
  'video',
  'video_category',
  'cancelMembership',
  'email-verify',
  'finishSignUp',
  'login',
  'marketing',
  'recoverPassword',
  'service-rule',
  'updatePassword',
  'verify-success',
]

// check if the req url is asking a page(html)
export function isPageRequesting(req) {
  return (
    req.method === 'GET' &&
    (req.path === '/' || pageNames.includes(req.path.split('/')[1]))
  )
}
