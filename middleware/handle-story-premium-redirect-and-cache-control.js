import { checkCategoryHasMemberOnly } from '~/utils/article'
const qs = require('querystring')

export default async function ({ res, route, app, redirect }) {
  const slug = route?.params?.slug
  try {
    const result = await app.$fetchPostsFromMembershipGateway({
      slug,
      isAudioSiteOnly: false,
      clean: 'content',
      related: 'article',
    })
    const post = result?.items?.[0] ?? {}

    const doesCategoryHaveMemberOnly = checkCategoryHasMemberOnly(post)

    if (doesCategoryHaveMemberOnly) {
      // disable cache to prevent caching both full article content and sliced article content with the same /premium/:slug uri
      res.setHeader('Cache-Control', 'no-store')
      if (route.name === 'story-slug') {
        return redirect(`/premium/${slug}?${qs.stringify(route.query)}`)
      }
    } else if (route.name === 'premium-slug') {
      return redirect(`/story/${slug}?${qs.stringify(route.query)}`)
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}
