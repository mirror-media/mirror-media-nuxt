<template>
  <div
    :class="[
      {
        listing: isListing,
        'listing--white-background': isSearchPage,
        'story-page': isStory,
      },
    ]"
  >
    <ContainerHeader />
    <nuxt />
    <UIFooter :class="[{ 'footer--listing': isListing }]" />
  </div>
</template>

<script>
import {
  reactive,
  onBeforeMount,
  onBeforeUnmount,
  useContext,
} from '@nuxtjs/composition-api'
import { rafWithDebounce } from '~/utils/animation.js'

import ContainerHeader from '~/components/ContainerHeader.vue'
import UIFooter from '~/components/UIFooter.vue'

export default {
  components: {
    ContainerHeader,
    UIFooter,
  },
  setup() {
    const { store } = useContext()

    useViewport((viewport) => {
      store.commit('viewport/setViewport', viewport)
    })
  },
  async fetch() {
    const [partnersResponse, topicsResponse] = await Promise.allSettled([
      this.$store.dispatch('partners/fetchPartnersData'),
      this.$store.dispatch('topics/fetchTopicsData'),
    ])

    if (partnersResponse.status === 'fulfilled') {
      this.commitPartnersData(partnersResponse.value)
    }
    if (topicsResponse.status === 'fulfilled') {
      this.commitTopicsData(topicsResponse.value)
    }
  },
  computed: {
    isListing() {
      const listingRouteNames = [
        'section-name',
        'category-name',
        'author-id',
        'section-topic',
        'search-keyword',
        'topic-id',
        'tag-id',
      ]
      return listingRouteNames.includes(this.$route.name)
    },
    isSearchPage() {
      return this.$route.name === 'search-keyword'
    },
    isStory() {
      return this.$route.path.match(/\/story\//)
    },
  },
  methods: {
    commitPartnersData(response) {
      this.$store.commit('partners/setPartnersData', response)
    },
    commitTopicsData(response) {
      this.$store.commit(
        'topics/setTopicsData',
        response.endpoints.topics ?? {}
      )
    },
  },
}

function useViewport(syncViewport) {
  const viewport = reactive({
    width: 0,
    height: 0,
  })

  onBeforeMount(() => {
    updateViewport()

    window.addEventListener('resize', updateViewportWithRaf)
    window.addEventListener('orientationChange', updateViewportWithRaf)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateViewport)
    window.removeEventListener('orientationChange', updateViewport)
  })

  function updateViewport() {
    /**
     * 不用 document.documentElement.clientWidth 和 .clientHeight 的原因：
     * 為了與 CSS media queries 判斷寬高的方式相同
     */
    ;({ innerWidth: viewport.width, innerHeight: viewport.height } = window)

    syncViewport(viewport)
  }

  function updateViewportWithRaf() {
    rafWithDebounce(() => {
      updateViewport()
    })
  }
}
</script>

<style lang="scss" scoped>
.listing {
  background-color: #f2f2f2;
  padding: 0 0 60px 0;
  @include media-breakpoint-up(xl) {
    padding: 0;
  }

  // most of the listing page's background-color is #f2f2f2, except search page
  &--white-background {
    background-color: white;
  }
}

.story-page {
  @include media-breakpoint-up(lg) {
    background-color: #414141;
  }
}

.footer {
  &--listing {
    margin: 0 32px;
    @include media-breakpoint-up(xl) {
      max-width: 1024px;
      margin: 60px auto 0 auto;
    }
  }
}
</style>
