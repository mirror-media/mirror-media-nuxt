import { checkCategoryHasMemberOnly } from '~/utils/article'
const qs = require('querystring')

export default async function ({ res, route, app, redirect }) {
  const slug = route?.params?.slug
  try {
    const result = await app.$fetchStoryFromMembershipGateway({
      slug,
      isAudioSiteOnly: false,
      clean: 'content',
      related: 'article',
    })
    const post = result?.items?.[0] ?? {}

    const doesCategoryHaveMemberOnly = checkCategoryHasMemberOnly(post)

    if (doesCategoryHaveMemberOnly) {
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
