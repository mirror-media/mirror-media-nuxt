<template>
  <div class="story-container">
    <UIStoryBody :story="story" />
  </div>
</template>

<script>
import { SITE_OG_IMAGE, SITE_TITLE, SITE_URL } from '~/constants/index'
import UIStoryBody from '~/components/UIStoryBody.vue'

export default {
  name: 'Story',
  components: {
    UIStoryBody,
  },
  async fetch() {
    const response = await this.$fetchPosts({
      slug: this.$route.params.slug,
      isAudioSiteOnly: false,
      clean: 'content',
    })
    this.story = response.items[0] ?? {}
  },
  data() {
    return {
      story: {},
    }
  },
  head() {
    const {
      brief = {},
      categories = [],
      heroImage = {},
      isAdult = false,
      ogDescription = '',
      ogImage = {},
      ogTitle = '',
      publishedDate = '',
      sections = [],
      slug = '',
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
    const image =
      ogImage.image?.resizedTargets?.mobile?.url ||
      heroImage.image?.resizedTargets?.mobile?.url ||
      SITE_OG_IMAGE
    const pageUrl = `${SITE_URL}${this.$route.path}`
    const publishedTime = publishedDate
      ? new Date(publishedDate).toISOString()
      : ''
    const section = sections[0] ?? {}
    const category = categories[0] ?? {}
    const topicId = topics._id ?? ''
    const writer = writers[0]?.name ?? ''

    return {
      title,
      meta: [
        { hid: 'robots', name: 'robots', content: robots },
        { hid: 'description', name: 'description', description },
        { hid: 'og:title', property: 'og:title', content: metaTitle },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        { hid: 'og:image', property: 'og:image', content: image },
        {
          hid: 'og:url',
          property: 'og:url',
          content: pageUrl,
        },
        { name: 'section-name', content: section.name ?? '' },
        { name: 'category-name', content: category.name ?? '' },
        { name: 'topic-id', content: topicId },
        { hid: 'twitter:title', name: 'twitter:title', content: metaTitle },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: image },
        { property: 'dable:item_id', content: slug },
        { property: 'dable:author', content: writer },
        { property: 'article:section', content: section.title ?? '' },
        { property: 'article:section2', content: category.title ?? '' },
        { property: 'article:published_time', content: publishedTime },
      ],
      link: [
        { rel: 'canonical', href: pageUrl },
        { rel: 'amphtml', href: `${SITE_URL}/story/amp/${slug}/` },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.story-container {
  max-width: 1160px;
  @include media-breakpoint-up(lg) {
    margin: 0 auto;
    padding: 30px 50px;
    background-color: #fff;
  }
}
</style>
