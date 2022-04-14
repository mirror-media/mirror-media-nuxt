import { checkCategoryHasMemberOnly } from '~/utils/article'
const qs = require('querystring')

export default async function ({ res, route, app, redirect, store }) {
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
      redirectToPremiumPage({ redirect, route })
    } else if (store.getters['membership-subscribe/isPremiumMember']) {
      redirectToPreStoryPage({ redirect, route })
    } else {
      redirectToStoryPage({ redirect, route })
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
  }
}

function redirectToOtherPage({ redirect, href }) {
  if (typeof window !== 'undefined') {
    window.location.href = href
    return
  }
  redirect(href)
}

function redirectToPremiumPage({ redirect, route }) {
  if (route.name === 'story-slug' || route.name === 'pre-story-slug') {
    redirectToOtherPage({
      redirect,
      href: `/premium/${route?.params?.slug}?${qs.stringify(route.query)}`,
    })
  }
}

function redirectToPreStoryPage({ redirect, route }) {
  if (route.name === 'premium-slug' || route.name === 'story-slug') {
    redirectToOtherPage({
      redirect,
      href: `/pre/story/${route?.params?.slug}?${qs.stringify(route.query)}`,
    })
  }
}

function redirectToStoryPage({ redirect, route }) {
  if (route.name === 'premium-slug' || route.name === 'pre-story-slug') {
    redirectToOtherPage({
      redirect,
      href: `/story/${route?.params?.slug}?${qs.stringify(route.query)}`,
    })
  }
}
