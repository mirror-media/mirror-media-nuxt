<template>
  <section class="culture-post">
    <a
      :href="SITE_URL"
      class="culture-post__logo"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="~/assets/logo@2x.png" :alt="SITE_TITLE" />
    </a>

    <UiCulturePostIndex
      v-if="indexes.length > 0"
      :items="indexes"
      :currentIndex="currentIndex"
      :isIndexActive="isIndexActive"
      @closeIndex="handleIndexActive(false)"
      @openIndex="handleIndexActive(true)"
    />

    <UiCulturePostIntro :post="post" />

    <UiCulturePostContent :content="post.content" />

    <UiCulturePostRelateds v-if="relateds.length > 0" :items="relateds" />

    <div v-if="updatedAt" class="culture-post__updated-at">
      更新時間 / {{ updatedAt }}
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import { formatDate } from '~/utils/article.js'
import { SITE_OG_IMG, SITE_TITLE, SITE_URL } from '~/constants/index'

import UiCulturePostContent from '~/components/culture-post/UiCulturePostContent.vue'
import UiCulturePostIndex from '~/components/culture-post/UiCulturePostIndex.vue'
import UiCulturePostIntro from '~/components/culture-post/UiCulturePostIntro.vue'
import UiCulturePostRelateds from '~/components/culture-post/UiCulturePostRelateds.vue'

export default {
  name: 'ContainerCulturePost',

  components: {
    UiCulturePostContent,
    UiCulturePostIndex,
    UiCulturePostIntro,
    UiCulturePostRelateds,
  },

  props: {
    story: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },

  data() {
    return {
      SITE_TITLE,
      SITE_URL,

      currentIndex: 0,
      isIndexActive: false,
    }
  },

  computed: {
    ...mapGetters({
      isViewportWidthUpXl: 'viewport/isViewportWidthUpXl',
    }),
    post() {
      const {
        title = '',
        titleColor = '',
        brief = {},
        writers = [],
        photographers = [],
        cameraMan = [],
        extendByline = '',
        content = {},
        heroImage = {},
        mobileImage = {},
        publishedDate = '',
        updatedAt = '',
        relateds = [],
      } = this.story

      return {
        title,
        titleColor,
        brief: this.gainBriefHtml(brief.apiData || []),
        writers: this.joinNames(writers),
        photographers: this.joinNames(photographers),
        cameraMan: this.joinNames(cameraMan),
        extendByline,
        content: content.apiData || [],
        heroImage: heroImage.image?.resizedTargets || {},
        mobileImage: mobileImage.image?.resizedTargets || {},
        publishedDate: formatDate(publishedDate),
        updatedAt: formatDate(updatedAt),
        relateds,
      }
    },
    indexes() {
      return this.post.content
        .filter((item) => item.type === 'header-one' && item.content?.[0])
        .map((item) => ({
          id: item.id,
          content: item.content[0],
        }))
    },
    updatedAt() {
      return this.post.updatedAt
    },
    relateds() {
      return this.post.relateds
    },
  },

  watch: {
    isViewportWidthUpXl(isUp) {
      if (isUp) {
        this.isIndexActive = false
      }
    },
  },

  mounted() {
    this.detectCurrentIndex()
  },

  methods: {
    gainBriefHtml(apiData = []) {
      return apiData
        .filter((item) => item.type === 'unstyled')
        .reduce(function buildHtml(acc, cur) {
          return `${acc}<p>${cur?.content?.[0]}</p>`
        }, '')
    },
    joinNames(items = []) {
      return items.map((item) => item.name).join(' ')
    },

    detectCurrentIndex() {
      import('intersection-observer').then(() => {
        const targets = [
          ...document.querySelectorAll('.culture-post .content h2'),
        ]
        let observer

        {
          const ids = targets.map((target) => target.id)

          observer = new IntersectionObserver(
            function callback(entries) {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  this.currentIndex = ids.indexOf(entry.target.id) + 1 || 0
                }
              })
            }.bind(this),
            {
              threshold: 1,
            }
          )
        }

        targets.forEach((element) => {
          observer.observe(element)
        })
      })
    },
    handleIndexActive(isActive) {
      this.isIndexActive = isActive
    },
  },

  head() {
    const { title = '', brief = '', heroImage = {} } = this.post
    const description = brief.replace(/(<([^>]+)>)/gi, '')
    const image = heroImage.desktop?.url || SITE_OG_IMG

    return {
      title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        { hid: 'og:title', property: 'og:title', content: title },
        {
          hid: 'og:description',
          property: 'og:description',
          content: description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}${this.$route.path}`,
        },
        { hid: 'og:image', property: 'og:image', content: image },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        { hid: 'twitter:image', name: 'twitter:image', content: image },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.culture-post {
  color: rgba(#000, 0.87);
  word-break: break-word;
  overflow-wrap: break-word;

  &__logo {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 900;
    width: 44px;

    img {
      width: 100%;
    }
  }

  &__updated-at {
    width: 300px;
    padding-top: 12px;
    padding-bottom: 15px;
    margin-left: auto;
    margin-right: auto;
    color: rgba(#000, 0.66);
    font-size: 13px;
    line-height: 2.31;
    letter-spacing: 1px;
    text-align: center;
    border-top: 1px solid #979797;
    @include media-breakpoint-up(md) {
      width: 700px;
    }
    @include media-breakpoint-up(lg) {
      width: 900px;
    }
  }
}
</style>
