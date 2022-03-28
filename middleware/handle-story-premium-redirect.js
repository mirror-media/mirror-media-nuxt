import { checkCategoryHasMemberOnly } from '~/utils/article'
const qs = require('querystring')

export default async function (
  { res, route, app, redirect, store },
  shouldPerformRedirect = true
) {
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
      const _redirect = redirectToPremiumPage({ redirect, route })
      if (shouldPerformRedirect) {
        _redirect()
      } else {
        return _redirect
      }
    } else if (store.getters['membership-subscribe/isPremiumMember']) {
      const _redirect = redirectToPreStoryPage({ redirect, route })
      if (shouldPerformRedirect) {
        _redirect()
      } else {
        return _redirect
      }
    } else {
      const _redirect = redirectToStoryPage({ redirect, route })
      if (shouldPerformRedirect) {
        _redirect()
      } else {
        return _redirect
      }
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

function redirectToPremiumPage({ redirect, route }) {
  if (route.name === 'story-slug' || route.name === 'pre-story-slug') {
    return () => {
      redirect(`/premium/${route?.params?.slug}?${qs.stringify(route.query)}`)
    }
  }
}

function redirectToPreStoryPage({ redirect, route }) {
  if (route.name === 'premium-slug' || route.name === 'story-slug') {
    return () => {
      redirect(`/pre/story/${route?.params?.slug}?${qs.stringify(route.query)}`)
    }
  }
}

function redirectToStoryPage({ redirect, route }) {
  if (route.name === 'premium-slug' || route.name === 'pre-story-slug') {
    return () => {
      redirect(`/story/${route?.params?.slug}?${qs.stringify(route.query)}`)
    }
  }
}
