<template>
  <section class="culture-post">
    <a :href="SITE_URL" class="logo" target="_blank" rel="noopener noreferrer">
      <img src="~/assets/logo@2x.png" :alt="SITE_TITLE" />
    </a>

    <UiArticleIndex
      v-if="indexes.length > 0"
      :items="indexes"
      :currentIndex="currentIndex"
      :isIndexActive="isIndexActive"
      @closeIndex="handleIndexActive(false)"
      @openIndex="handleIndexActive(true)"
    />

    <UiTheCover :title="post.title" :picture="post.coverPicture" />

    <div class="info">
      <div>發布時間 {{ post.publishedDate }}</div>

      <div class="credit">
        <span v-for="credit in post.credits" :key="credit">{{ credit }}</span>
      </div>
    </div>

    <UiArticleBody
      class="culture-post__article-body"
      :brief="post.brief"
      :content="post.content"
    />

    <lazy-component @show="fetchRelatedImgs">
      <UiListRelated
        v-if="relateds.length > 0"
        :items="relateds"
        :imgs="relatedImgs"
      />
    </lazy-component>

    <div v-if="updatedAt" class="updated-at">更新時間／{{ updatedAt }}</div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

import UiTheCover from './UiTheCover.vue'
import UiArticleBody from './UiArticleBody.vue'
import UiArticleIndex from './UiArticleIndex.vue'
import UiListRelated from './UiListRelated.vue'

import { SITE_OG_IMG, SITE_TITLE, SITE_URL } from '~/constants/index'

export default {
  name: 'ContainerCulturePost',

  components: {
    UiTheCover,
    UiArticleBody,
    UiArticleIndex,
    UiListRelated,
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

      relatedImgs: [],
    }
  },

  computed: {
    ...mapGetters({
      isViewportWidthUpXl: 'viewport/isViewportWidthUpXl',
    }),
    post() {
      const {
        title = '',
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

      const heroImgsResized = heroImage.image?.resizedTargets || {}

      return {
        title,
        credits: gainCredits(),
        brief: gainBrief(),
        content: content.apiData || [],
        heroImage: heroImgsResized,
        coverPicture: {
          heroImage: heroImgsResized,
          mobileImage: mobileImage.image?.resizedTargets || {},
        },
        publishedDate: formatDate(publishedDate),
        updatedAt: formatDate(updatedAt),
        relateds,
      }

      function gainCredits() {
        return [
          [writers, '記者'],
          [photographers, '攝影'],
          [cameraMan, '影音'],
          [extendByline, ''],
        ]
          .filter(doesHaveAnyPeople)
          .map(buildText)

        function doesHaveAnyPeople([people]) {
          return people.length > 0
        }

        function buildText([people, role]) {
          return role !== '' ? `${role}／${joinNames(people)}` : people
        }

        function joinNames(items = []) {
          return items.map((item) => item.name).join('、')
        }
      }

      function gainBrief() {
        return brief.apiData
          .filter((item = {}) => item.type === 'unstyled' && item.content?.[0])
          .map((item) => ({
            id: item.id,
            content: item.content[0],
          }))
      }

      function formatDate(date) {
        return dayjs(date).format('YYYY.M.D')
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

    async fetchRelatedImgs() {
      if (this.relatedImgs.length > 0) {
        return
      }

      const imgIds = this.relateds.map((item) => item.heroImage)
      const { items = [] } = await this.$fetchImages({ id: imgIds })

      this.relatedImgs = items
    },
  },

  head() {
    const { title = '', brief = '', heroImage = {} } = this.post
    const description = brief.map((item) => item.content).join('')
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

  &__article-body {
    margin-left: auto;
    margin-right: auto;
  }
}

.logo {
  position: fixed;
  top: 10px;
  left: 10px;
  z-index: 900;
  width: 44px;

  img {
    width: 100%;
  }
}

.info,
.updated-at {
  font-size: 13px;
  line-height: 2.31;
  text-align: center;
  color: rgba(#000, 0.66);
}

.info {
  padding: 16px 31px;
  margin-bottom: 24px;
  @include media-breakpoint-up(lg) {
    padding-top: 24px;
    padding-bottom: 24px;
    margin-bottom: 60px;
  }
}

.credit {
  margin-top: 4px;

  span + span {
    margin-left: 12px;
    @include media-breakpoint-up(lg) {
      margin-left: 24px;
    }
  }
}

.updated-at {
  width: 300px;
  padding-top: 12px;
  padding-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
  letter-spacing: 1px;
  border-top: 1px solid #979797;
  @include media-breakpoint-up(md) {
    width: 700px;
  }
  @include media-breakpoint-up(lg) {
    width: 900px;
  }
}
</style>
