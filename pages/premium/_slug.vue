<template>
  <div class="story-slug">
    <ContainerCulturePostWide
      v-if="isStyleWide"
      :story="story"
      :isPremium="true"
      :isLoading="isLoading"
      :isFail="isFail"
      :failTimes="failTimes"
      :shouldShwowAd="shouldShwowAd"
    />
    <ContainerCulturePost
      v-else
      :story="story"
      :isLoading="isLoading"
      :isFail="isFail"
      :failTimes="failTimes"
      :shouldShwowAd="shouldShwowAd"
      @reload="handleReload"
    />
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import { DOMAIN_NAME } from '~/configs/config'
import ContainerCulturePostWide from '~/components/culture-post/ContainerCulturePost.vue'
import ContainerCulturePost from '~/components/culture-post-for-premium/ContainerCulturePost.vue'
import {
  SITE_DESCRIPTION,
  SITE_OG_IMG,
  SITE_TITLE,
  SITE_URL,
} from '~/constants'
import saveMemberArticleHistoryLocally from '~/mixins/save-member-article-history-locally'

import { DABLE_WIDGET_IDS } from '~/constants/ads'
import { checkCategoryHasMemberOnly } from '~/utils/article'

import { PREMIUM_AD_FEATURE_TOGGLE } from '~/configs/config.js'
const _ = { isEmpty }

export default {
  layout: 'empty',
  middleware: ['handle-story-premium-redirect'],
  components: {
    ContainerCulturePost,
    ContainerCulturePostWide,
  },
  mixins: [saveMemberArticleHistoryLocally],
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
      isLoading: true,
      isFail: false,
      failTimes: 0,
      PREMIUM_AD_FEATURE_TOGGLE,
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
    shouldShwowAd() {
      if (!this.PREMIUM_AD_FEATURE_TOGGLE) return false
      return (
        this.story.isTruncated ||
        this.$store.state['membership-subscribe']?.basicInfo?.type ===
          'marketing'
      )
    },
    isStyleWide() {
      return this.story.style === 'wide'
    },
  },
  async beforeMount() {
    if (this.$store.getters['membership/isLoggedIn']) {
      this.isLoading = true
      await this.fetchPost(this.$store.state.membership.userToken)
      this.$ga.set('dimension1', 'isMember')

      // dimension about isTruncated of the story content
      const msg = this.story.isTruncated?.toString()
      this.$ga.set('dimension2', msg)

      // dimension of member type
      this.$ga.set(
        'dimension3',
        this.$store.state['membership-subscribe'].basicInfo.type
      )
    } else {
      this.$ga.set('dimension1', 'notMember')

      // dimension about isTruncated of the story content
      this.$ga.set('dimension2', 'false')

      this.isLoading = false
    }

    this.$store.commit('premium-story/SET_STORY', this.story)

    this.$sendUserBehaviorLog({
      category: 'whole-site',
      description: '',
      'event-type': 'pageview',
      'page-type': 'premium-story',
      'member-info-firebase': {
        userEmailVerified: this.$store?.state?.membership?.userEmailVerified,
        userSignInInfo: this.$store?.state?.membership?.userSignInInfo,
        userEmail: this.$store?.state?.membership?.userEmail,
        user: this.$store?.state?.membership?.user,
      },
      'member-info-israfel': {
        basicInfo: this.$store?.state['membership-subscribe']?.basicInfo,
      },

      'premium-story-info': this.premiumStoryInfoForLogger(),
    })
  },

  methods: {
    premiumStoryInfoForLogger() {
      if (_.isEmpty(this.$store?.state?.['premium-story']?.story)) {
        return { story: {} }
      } else {
        const {
          heroImage: {
            image: { resizedTargets, ...remainImageInfo },
            ...remainHeroImageInfo
          } = {
            image: {},
          },
          links,
          engineers,
          relateds,
          ...remainStoryInfo
        } = this.$store?.state?.['premium-story']?.story

        return {
          story: {
            heroImage: {
              image: { ...remainImageInfo },
              ...remainHeroImageInfo,
            },
            ...remainStoryInfo,
          },
        }
      }
    },
    handleReload() {
      this.isFail = false
      this.fetchPost(this.$store.state.membership.userToken)
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

      this.$store.commit(
        'setCanAdvertise',
        !this.story.hiddenAdvertised ?? true
      )
    },
    async fetchPost(token) {
      if (this.isLoading && this.failTimes) return
      this.isLoading = true
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
        this.isLoading = false
        this.story = postResponse.value.items?.[0] ?? {}
        this.membershipTokenState = postResponse.value.tokenState
      } else {
        setTimeout(() => {
          this.isLoading = false
          this.isFail = true
          this.failTimes++
          const { message } = postResponse.reason
          this.$sendMembershipErrorLog({
            email: this.$store.state.membership.userEmail,
            token: this.$store.state.membership.userToken,
            firebaseId: this.$store.state.membership.userUid,
            memberType:
              this.$store.state['membership-subscribe'].basicInfo.type,
            description: message,
            eventType: 'premiumFetchPostError',
          })
        }, 0)

        /*
         * this.$nuxt.error({
         *   message,
         *   statusCode,
         * })
         */
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
        tagNamesStr !== ''
          ? { hid: 'keywords', name: 'keywords', content: tagNamesStr }
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
          skip: !this.shouldShwowAd,
          rel: 'preload',
          href: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',
          as: 'script',
        },
      ],
      script: [
        ...jsonLds.bind(this)(),
        {
          hid: 'gptScript',
          skip: !this.shouldShwowAd,
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

<style lang="scss" scoped>
.story-slug {
  &__sim {
    background: #000;
    border: 1px solid #000;
    color: #fff;
    display: block;
    position: fixed;
    right: 0;
    top: 200px;
    opacity: 0.5;
    padding: 10px;
    border-radius: 4px;
    z-index: 100;
  }
}
</style>
