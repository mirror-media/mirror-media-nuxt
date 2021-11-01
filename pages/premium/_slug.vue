<template>
  <div class="story-slug">
    <ContainerCulturePost :story="story" />
  </div>
</template>

<script>
import ContainerCulturePost from '~/components/culture-post-for-premium/ContainerCulturePost.vue'
import {
  SITE_DESCRIPTION,
  SITE_OG_IMG,
  SITE_TITLE,
  SITE_URL,
} from '~/constants'
import { DOMAIN_NAME } from '~/configs/config'
import { DABLE_WIDGET_IDS } from '~/constants/ads'
import { checkCategoryHasMemberOnly } from '~/utils/article'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  layout: 'empty',
  middleware: ['handle-story-premium-redirect-and-cache-control'],
  components: {
    ContainerCulturePost,
  },
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
    }
  },
  async fetch() {
    /*
     * fetch post in server side for composing meta tag properties, not article content
     * article content is fetch in client side
     */
    await this.fetchStory()
  },
  data() {
    return {
      story: {},
      membershipTokenState: undefined,
    }
  },
  computed: {
    storySlug() {
      return this.$route.params.slug
    },
    doesCategoryHaveMemberOnly() {
      return checkCategoryHasMemberOnly(this.story)
    },
    shouldShowPremiumStory() {
      return this.doesCategoryHaveMemberOnly
    },
  },
  beforeMount() {
    this.setGaDimensionOfMembership()
    if (this.$store.getters['membership/isLoggedIn']) {
      this.fetchPost(this.$store.state.membership.userToken)
    }
  },
  methods: {
    setGaDimensionOfMembership() {
      const dimensionMembership = this.$store.getters['membership/isLoggedIn']
        ? 'isMember'
        : 'notMember'

      this.$ga.set('dimension1', dimensionMembership)
    },
    async fetchStory() {
      const [postResponse] = await Promise.allSettled([
        this.$fetchStoryFromMembershipGateway({
          slug: this.storySlug,
          isAudioSiteOnly: false,
          clean: 'content',
          related: 'article',
        }),
      ])

      if (postResponse.status === 'fulfilled') {
        this.story = postResponse.value.items?.[0] ?? {}
      } else {
        const { message, statusCode } = postResponse.reason

        this.$nuxt.error({
          message,
          statusCode,
        })
      }
    },
    async fetchPost(token) {
      const [postResponse] = await Promise.allSettled([
        this.$fetchPostsFromMembershipGateway(
          {
            slug: this.storySlug,
            isAudioSiteOnly: false,
            clean: 'content',
            related: 'article',
          },
          token
        ),
      ])

      if (postResponse.status === 'fulfilled') {
        this.story = postResponse.value.items?.[0] ?? {}
        this.membershipTokenState = postResponse.value.tokenState
      } else {
        const { message, statusCode } = postResponse.reason

        this.$sendMembershipErrorLog({
          email: this.$store.state.membership.userEmail,
          token: this.$store.state.membership.userToken,
          firebaseId: this.$store.state.membership.userUid,
          memberType: this.$store.state['membership-subscribe'].basicInfo.type,
          xstate: this.stateMembershipSubscribe,
          description: message,
          eventType: 'premiumFetchPostError',
        })

        this.$nuxt.error({
          message,
          statusCode,
        })
      }
    },
  },
  head() {
    const {
      brief = {},
      heroImage = {},
      isAdult = false,
      ogDescription = '',
      ogImage = {},
      ogTitle = '',
      publishedDate = Date.now(),
      updatedAt = Date.now(),
      title = '',
      topics = {},
      writers = [],
      tags = [],
    } = this.story
    const robots = isAdult ? 'noindex' : 'index'
    const metaTitle = ogTitle || title || SITE_TITLE
    const description =
      ogDescription ||
      brief.apiData
        ?.find((item) => item.type === 'unstyled')
        ?.content?.[0]?.replace(/<\/?[^>]+(>|$)/gm, '') ||
      ''
    const imgUrl =
      ogImage?.image?.resizedTargets?.tablet?.url ||
      heroImage?.image?.resizedTargets?.tablet?.url ||
      SITE_OG_IMG
    const dableImgUrl =
      ogImage?.image?.resizedTargets?.tiny?.url ||
      heroImage?.image?.resizedTargets?.tiny?.url ||
      SITE_OG_IMG
    const pageUrl = `https://${DOMAIN_NAME}${this.$route.path}`

    const publishedDateIso = new Date(publishedDate).toISOString()
    const topicId = topics?._id ?? ''
    const { name: writerName, id: writerId } = writers[0] || {}
    const tagNamesStr = tags.map((tag) => tag.name).join(', ')

    return {
      title,
      meta: [
        { hid: 'robots', name: 'robots', content: robots },
        { hid: 'description', name: 'description', content: description },
        { hid: 'og:title', property: 'og:title', content: metaTitle },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        { hid: 'og:image', property: 'og:image', content: imgUrl },
        {
          hid: 'og:url',
          property: 'og:url',
          content: pageUrl,
        },
        tagNamesStr !== ''
          ? {
              name: 'news_keywords',
              content: tagNamesStr,
            }
          : {},
        this.hasSection
          ? { name: 'section-name', content: this.sectionName }
          : {},
        this.hasCategory
          ? { name: 'category-name', content: this.category.name }
          : {},
        { name: 'topic-id', content: topicId },
        { hid: 'twitter:title', name: 'twitter:title', content: metaTitle },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: imgUrl },
        { property: 'dable:item_id', content: this.storySlug },
        { property: 'dable:author', content: writerName },
        { property: 'dable:image', content: dableImgUrl },
        this.hasSection
          ? {
              property: 'article:section',
              content: this.sectionTitle,
            }
          : {},
        this.hasCategory
          ? { property: 'article:section2', content: this.categoryTitle }
          : {},
        { property: 'article:published_time', content: publishedDateIso },
      ],
      link: [
        { rel: 'canonical', href: pageUrl },
        {
          hid: 'gptLink',
          skip: !this.canAdvertise,
          rel: 'preload',
          href: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
          as: 'script',
        },
      ],
      script: [
        ...jsonLds.bind(this)(),
        {
          hid: 'gptScript',
          skip: !this.canAdvertise,
          src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
          async: true,
        },
        {
          hid: 'dable',
          skip: !this.shouldLoadDableScript,
          innerHTML: `
            (function (d, a, b, l, e, _) {
              if (d[b] && d[b].q) return
              d[b] = function () {
                ;(d[b].q = d[b].q || []).push(arguments)
              }
              e = a.createElement(l)
              e.async = 1
              e.charset = 'utf-8'
              e.src = '//static.dable.io/dist/plugin.min.js'
              _ = a.getElementsByTagName(l)[0]
              _.parentNode.insertBefore(e, _)
            })(window, document, 'dable', 'script')
            dable('setService', 'mirrormedia.mg')
            dable('sendLogOnce')
            dable('renderWidget', 'dablewidget_${DABLE_WIDGET_IDS.MB}')
            dable('renderWidget', 'dablewidget_${DABLE_WIDGET_IDS.PC}')
          `,
        },
        {
          hid: 'popinAd',
          skip: !this.shouldLoadPopinScript,
          innerHTML: `
            (function () {
              var pa = document.createElement('script')
              pa.type = 'text/javascript'
              pa.charset = 'utf-8'
              pa.async = true

              pa.src =
                window.location.protocol +
                '//api.popin.cc/searchbox/mirrormedia_tw.js'

              var s = document.getElementsByTagName('script')[0]
              s.parentNode.insertBefore(pa, s)
            })()
          `,
        },
      ],
      __dangerouslyDisableSanitizersByTagID: {
        dable: ['innerHTML'],
        popinAd: ['innerHTML'],
      },
    }

    function jsonLds() {
      let jsonLdNewsArticle
      const jsonLdBreadcrumbList = {
        type: 'application/ld+json',
        json: {
          '@context': 'http://schema.org/',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbList.bind(this)(),
        },
      }

      {
        const hasWriter = writers[0] !== undefined
        const authorName = hasWriter ? writerName : '鏡週刊'
        const logoUrl = require('~/assets/logo.png')

        jsonLdNewsArticle = {
          type: 'application/ld+json',
          json: {
            '@context': 'https://schema.org/',
            '@type': 'NewsArticle',
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': pageUrl,
            },
            headline: title,
            image: imgUrl,
            datePublished: publishedDateIso,
            dateModified: new Date(updatedAt).toISOString(),
            author: {
              '@type': hasWriter ? 'Person' : 'Organization',
              name: authorName,
            },
            publisher: {
              '@type': 'Organization',
              name: SITE_TITLE,
              logo: {
                '@type': 'ImageObject',
                url: logoUrl,
              },
            },
            description,
            url: pageUrl,
            thumbnailUrl: imgUrl,
            articleSection: this.hasSection ? this.sectionTitle : undefined,
          },
        }

        if (hasWriter) {
          const jsonLdPerson = {
            type: 'application/ld+json',
            json: {
              '@context': 'http://schema.org/',
              '@type': 'Person',
              name: authorName,
              url: `${SITE_URL}/author/${writerId}/`,
              brand: {
                '@type': 'Brand',
                name: SITE_TITLE,
                url: SITE_URL,
                image: logoUrl,
                logo: logoUrl,
                description: SITE_DESCRIPTION,
              },
            },
          }

          return [jsonLdNewsArticle, jsonLdPerson, jsonLdBreadcrumbList]
        }
      }

      return [jsonLdNewsArticle, jsonLdBreadcrumbList]
    }

    function breadcrumbList() {
      const items = [
        {
          '@type': 'ListItem',
          position: 1,
          name: SITE_TITLE,
          item: SITE_URL,
        },
      ]

      if (this.hasSection) {
        items.push({
          '@type': 'ListItem',
          position: items.length + 1,
          name: this.sectionTitle,
          item: `${SITE_URL}/section/${this.sectionName}`,
        })
      }

      items.push({
        '@type': 'ListItem',
        position: items.length + 1,
        name: title,
        item: pageUrl,
      })

      return items
    }
  },
}
</script>

<style lang="scss" scoped></style>
