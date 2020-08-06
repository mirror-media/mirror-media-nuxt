<template>
  <section class="culture-post">
    <a
      :href="SITE_URL"
      class="culture-post__logo"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img :alt="SITE_TITLE" src="~/assets/logo@2x.png" />
    </a>
    <UICulturePostIndex
      :currentIndex="currentIndex"
      :isIndexActive="isIndexActive"
      :items="indexes"
      @closeIndex="handleIndexActive(false)"
      @openIndex="handleIndexActive(true)"
    />
    <UICulturePostIntro :post="post" />
    <UICulturePostContent :content="post.content" />
    <UICulturePostRelateds v-if="hasRelateds" :items="relateds" />
    <div v-if="updatedAt" class="culture-post__updated-at">
      更新時間 / {{ updatedAt }}
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import { clearAllBodyScrollLocks, disableBodyScroll } from 'body-scroll-lock'
import { PREVIEW_QUERY } from '~/configs/config'
import { SITE_OG_IMAGE, SITE_TITLE, SITE_URL } from '~/constants/index'
import UICulturePostContent from '~/components/UICulturePostContent.vue'
import UICulturePostIndex from '~/components/UICulturePostIndex.vue'
import UICulturePostIntro from '~/components/UICulturePostIntro.vue'
import UICulturePostRelateds from '~/components/UICulturePostRelateds.vue'

const regexIsPreview = new RegExp(`${PREVIEW_QUERY}`, 'gs')

export default {
  name: 'CulturePost',
  layout: 'app',
  components: {
    UICulturePostContent,
    UICulturePostIndex,
    UICulturePostIntro,
    UICulturePostRelateds,
  },
  async fetch() {
    const slug = this.$route.params.slug
    const isPreview = regexIsPreview.test(this.$route.fullPath)
    const response = await this.$fetchCulturePosts(
      {
        slug,
        maxResults: 1,
        related: 'cultureposts',
      },
      isPreview
    )
    this.post = this.restructurePost(response.items?.[0])
  },
  data() {
    return {
      SITE_TITLE,
      SITE_URL,
      currentIndex: 0,
      isIndexActive: false,
      post: {},
    }
  },
  computed: {
    hasRelateds() {
      return this.relateds.length > 0
    },
    indexes() {
      const content = this.post.content || []
      return content
        .filter((item) => item.content?.[0] && item.type === 'header-one')
        .map((item) => ({
          id: item.id,
          content: item.content[0],
        }))
    },
    relateds() {
      return this.post.relateds || []
    },
    updatedAt() {
      return this.post.updatedAt
    },
  },
  watch: {
    isIndexActive(isActive) {
      isActive ? disableBodyScroll() : clearAllBodyScrollLocks()
    },
  },
  mounted() {
    this.detectCurrentIndex()
    window.addEventListener(
      'load',
      window.addEventListener('resize', this.handleResize)
    )
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    detectCurrentIndex() {
      import('intersection-observer').then(() => {
        const targets = [
          ...document.querySelectorAll('.culture-post .content h2'),
        ]
        const ids = targets.map((target) => target.id)
        const callback = (entries, observer) => {
          entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
              const current = ids.indexOf(entry.target.id) + 1 || 0
              this.currentIndex = current
            }
          })
        }
        const observer = new IntersectionObserver(callback, {
          threshold: 1,
        })
        targets.forEach((element) => {
          observer.observe(element)
        })
      })
    },
    getBrief(briefApiData) {
      return briefApiData
        .filter((paragraph) => paragraph.type === 'unstyled')
        .reduce((acc, cur) => `${acc}<p>${cur?.content?.[0]}</p>`, '')
    },
    handleResize: _.debounce(function () {
      const viewportWidth =
        window.innerWidth || document.documentElement.clientWidth
      if (viewportWidth >= 1200) {
        this.isIndexActive = false
      }
    }, 500),
    handleIndexActive(isActive) {
      this.isIndexActive = isActive
    },
    processItemsName(items = []) {
      return items.map((item) => item.name).join(' ')
    },
    restructurePost(post = {}) {
      return {
        brief: this.getBrief(post.brief?.apiData ?? {}),
        cameraMan: this.processItemsName(post.cameraMan),
        content: post.content?.apiData,
        extendByline: post.extendByline,
        heroImage: post.heroImage?.image?.resizedTargets ?? {},
        mobileImage: post.mobileImage?.image?.resizedTargets ?? {},
        photographers: this.processItemsName(post.photographers),
        publishedDate: this.$dayjs(post.publishedDate).format(
          'YYYY.MM.DD HH:mm:ss'
        ),
        relateds: post.relateds,
        title: post.title,
        titleColor: post.titleColor,
        updatedAt: this.$dayjs(post.updatedAt).format('YYYY.MM.DD HH:mm:ss'),
        writers: this.processItemsName(post.writers),
      }
    },
  },
  head() {
    const title = this.post.title
    const description = this.post.brief?.replace(/(<([^>]+)>)/gi, '')
    const image = this.post.heroImage?.desktop?.url || SITE_OG_IMAGE
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
  font-family: source-han-sans-traditional, -apple-system, 'Microsoft JhengHei',
    Helvetica, Arial, sans-serif;
  word-break: break-word;
  overflow-wrap: break-word;
  &::v-deep {
    h1,
    h2,
    h3,
    p {
      color: rgba(0, 0, 0, 0.87);
    }
    p {
      font-size: 15px;
      line-height: 2;
      & + p {
        margin-top: 2em;
      }
    }
  }
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
    margin: 0 auto;
    padding: 12px 0 15px;
    color: rgba(0, 0, 0, 0.66);
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
