<template>
  <div class="story-container">
    <UIStoryBody :story="story">
      <template v-slot:story-relateds>
        <UIStoryListWithArrow
          :categoryTitle="categoryTitle"
          :items="relateds"
          :sectionName="sectionName"
        />
        <UIStoryListRelated
          :items="relatedsWithoutFirstTwo"
          :images="relatedImages"
          @show="fetchRelatedImages"
        />
      </template>
    </UIStoryBody>

    <aside>
      <ClientOnly>
        <lazy-component class="story__fb-page">
          <FbPage />
        </lazy-component>

        <lazy-component
          v-if="isDesktopWidth"
          class="story__list story__list--latest"
          :style="{ height: hasLatestStories ? undefined : '100vh' }"
          @show="fetchLatestStories"
        >
          <UIStoryListWithHeading
            v-if="hasLatestStories"
            heading="最新文章"
            :items="latestStories"
            :extractTitle="sectionCategory"
          />
        </lazy-component>

        <lazy-component
          class="story__list story__list--popular"
          @show="fetchPopularStories"
        >
          <UIStoryListWithHeading
            v-if="hasPopularStories"
            heading="熱門文章"
            :items="popularStories"
          />
        </lazy-component>
      </ClientOnly>
    </aside>

    <UIAdultContentWarning v-if="story.isAdult" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

import { useFbQuotePlugin } from '~/composition/fb-plugins.js'

import UIAdultContentWarning from '~/components/UIAdultContentWarning.vue'
import UIStoryBody from '~/components/UIStoryBody.vue'
import UIStoryListRelated from '~/components/UIStoryListRelated.vue'
import UIStoryListWithArrow from '~/components/UIStoryListWithArrow.vue'
import FbPage from '~/components/FbPage.vue'
import UIStoryListWithHeading from '~/components/UIStoryListWithHeading.vue'

import { DOMAIN_NAME, ENV } from '~/configs/config'
import {
  SITE_OG_IMAGE,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
} from '~/constants/index'

export default {
  name: 'Story',
  setup() {
    useFbQuotePlugin()
  },
  components: {
    UIAdultContentWarning,
    UIStoryBody,
    UIStoryListRelated,
    UIStoryListWithArrow,
    FbPage,
    UIStoryListWithHeading,
  },
  async fetch() {
    const response = await this.$fetchPosts({
      slug: this.storySlug,
      isAudioSiteOnly: false,
      clean: 'content',
    })
    this.story = response.items[0] ?? {}
  },

  data() {
    return {
      latestStories: [],

      popularStories: [],
      story: {},
      relatedImages: [],
    }
  },

  computed: {
    ...mapGetters({
      isDesktopWidth: 'viewport/isViewportWidthUpLg',
    }),
    category() {
      return this.story.categories?.[0] || {}
    },
    hasCategory() {
      return !_.isEmpty(this.category)
    },
    categoryTitle() {
      return this.category.title ?? ''
    },
    relateds() {
      return (this.story.relateds ?? []).filter((item) => item.slug)
    },
    relatedsWithoutFirstTwo() {
      return this.relateds.slice(2)
    },
    section() {
      return this.story.sections?.[0] || {}
    },
    hasSection() {
      return !_.isEmpty(this.section)
    },
    sectionId() {
      return this.section.id ?? 'other'
    },
    storySlug() {
      return this.$route.params.slug
    },
    sectionName() {
      return this.section.name ?? ''
    },
    sectionTitle() {
      return this.section.title ?? ''
    },
    hasLatestStories() {
      return this.latestStories.length > 0
    },
    hasPopularStories() {
      return this.popularStories.length > 0
    },
  },

  methods: {
    async fetchRelatedImages() {
      const imageIds = this.relatedsWithoutFirstTwo.map(
        (item) => item.heroImage
      )
      const { items = [] } = await this.$fetchImages({ id: imageIds })
      this.relatedImages = items
    },
    async fetchLatestStories() {
      const { items = [] } = await this.$fetchList({
        sort: '-publishedDate',
        sections: this.sectionId,
      })

      this.latestStories = items
        .filter(this.doesNotHaveCurrentStorySlug)
        .slice(0, 6)
    },
    async fetchPopularStories() {
      if (ENV === 'lighthouse') {
        return
      }

      const { report: items = [] } = await this.$fetchPopular()
      this.popularStories = items.slice(0, 9)
    },
    sectionCategory(item = {}) {
      return item.categories?.[0]?.title || '新聞'
    },
    doesNotHaveCurrentStorySlug(item) {
      return item.slug !== this.storySlug
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
      publishedDate = '',
      updatedAt = '',
      title = '',
      topics = {},
      writers = [],
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
      ogImage?.image?.resizedTargets?.mobile?.url ||
      heroImage?.image?.resizedTargets?.mobile?.url ||
      SITE_OG_IMAGE
    const pageUrl = `https://${DOMAIN_NAME}${this.$route.path}`
    const publishedDateIso = new Date(publishedDate).toISOString()
    const topicId = topics._id ?? ''
    const { name: writerName, id: writerId } = writers[0] || {}

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
        { rel: 'amphtml', href: `${SITE_URL}/story/amp/${this.storySlug}/` },
      ],
      script: [...jsonLds.bind(this)()],
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
        const logoUrl = `${SITE_URL}/logo.png`

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
.story-container {
  max-width: 1160px;
  @include media-breakpoint-up(lg) {
    position: relative;
    margin: 0 auto;
    padding: 30px 50px;
    background-color: #fff;
  }
}

.story {
  &__list {
    margin-bottom: 20px;

    &--popular {
      @include media-breakpoint-up(lg) {
        order: 1;
      }
    }
  }

  &__fb-page {
    margin-bottom: 20px;
    @include media-breakpoint-up(lg) {
      order: 2;
      margin-bottom: 0;
    }
  }
}

aside {
  width: calc(100% - 50px);
  max-width: 645px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
  @include media-breakpoint-up(lg) {
    position: absolute;
    top: 30px;
    right: 50px;
    width: 300px;
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
  }
}
</style>
