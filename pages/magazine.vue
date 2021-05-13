<template>
  <section class="page">
    <h1 class="title">當期雜誌</h1>
    <div
      class="page__current-featured-magazine-wrapper current-featured-magazine-wrapper"
    >
      <UiMagazineFeatured
        class="current-featured-magazine-wrapper__magazine"
        :coverImgUrl="magazineFeatured[0].coverImgUrl"
        :label="magazineFeatured[0].issue"
        :title="magazineFeatured[0].title"
        :downloadLink="magazineFeatured[0].pdfLink"
        @downloadLinkClick="handleDownloadLinkClick"
      />
      <UiMagazineFeatured
        class="current-featured-magazine-wrapper__magazine"
        :coverImgUrl="magazineFeatured[1].coverImgUrl"
        :label="magazineFeatured[1].issue"
        :title="magazineFeatured[1].title"
        :downloadLink="magazineFeatured[1].pdfLink"
        @downloadLinkClick="handleDownloadLinkClick"
      />
    </div>
    <section
      class="page__magazine-showcase-list-wrapper magazine-showcase-list-wrapper"
    >
      <h1 class="title">近期雜誌</h1>
      <ol
        class="magazine-showcase-list-wrapper__magazine-showcase-list magazine-showcase-list"
      >
        <li
          v-for="item in magazineCurrent"
          :key="item.id"
          class="magazine-showcase-list__list-item magazine-showcase-list-item"
        >
          <UiMagazineShowcaseItem
            :coverImgUrl="item.coverImgUrl"
            :label="item.publishedDate"
            :title="item.issue"
            :downloadLink="item.pdfLink"
            @downloadLinkClick="handleDownloadLinkClick"
          />
        </li>
      </ol>
    </section>
    <section
      class="page__magazine-showcase-list-wrapper magazine-showcase-list-wrapper"
    >
      <h1 class="title">特刊</h1>
      <ol
        class="magazine-showcase-list-wrapper__magazine-showcase-list magazine-showcase-list"
      >
        <li
          v-for="item in magazineSpecial"
          :key="item.id"
          class="magazine-showcase-list__list-item magazine-showcase-list-item"
        >
          <UiMagazineShowcaseItem
            :coverImgUrl="item.coverImgUrl"
            :label="item.publishedDate"
            :title="item.issue"
            :downloadLink="item.pdfLink"
            @downloadLinkClick="handleDownloadLinkClick"
          />
        </li>
      </ol>
    </section>
    <template v-if="shouldLoadmore">
      <UiInfiniteLoading @infinite="infiniteHandler" />
    </template>
  </section>
</template>

<script>
import dayjs from 'dayjs'
import UiMagazineFeatured from '~/components/UiMagazineFeatured.vue'
import UiMagazineShowcaseItem from '~/components/UiMagazineShowcaseItem.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import fetchListAndLoadmore from '~/mixins/fetch-list-and-loadmore'

export default {
  components: {
    UiMagazineFeatured,
    UiMagazineShowcaseItem,
    UiInfiniteLoading,
  },
  middleware: ['authenticate'],
  mixins: [
    fetchListAndLoadmore({
      maxResults() {
        return 12
      },

      async fetchList(page) {
        return await this.$fetchMagazines({
          maxResults: 12,
          page,
          sort: '-publishedDate',
          magazineType: 'special',
        })
      },

      transformListItemContent(item) {
        return this.mapDataToComponentProps?.(item) || {}
      },
    }),
  ],
  async fetch() {
    const [responseMagazineWeekly] = await Promise.allSettled([
      this.$fetchMagazines({
        maxResults: 8,
        sort: '-publishedDate',
        magazineType: 'weekly',
      }),
      this.initList(),
    ])

    if (responseMagazineWeekly.status === 'fulfilled') {
      this.setListData(responseMagazineWeekly.value)
    }
  },
  data() {
    return {
      listData: [],
    }
  },
  computed: {
    magazineFeatured() {
      return this.listData.slice(0, 2)
    },
    magazineCurrent() {
      return this.listData.slice(2, Infinity)
    },
    magazineSpecialListItemsInFirstPage() {
      return this.listItems.slice(0, this.maxResults)
    },
    magazineSpecialListItemsInLoadmorePage() {
      return this.listItems.slice(this.maxResults, Infinity)
    },
    magazineSpecial() {
      return this.magazineSpecialListItemsInFirstPage.concat(
        this.magazineSpecialListItemsInLoadmorePage
      )
    },
  },
  methods: {
    mapDataToComponentProps(item) {
      return {
        id: item.id,
        type: item.type,
        title: item.title,
        issue: item.issue,
        publishedDate: dayjs(item.publishedDate).format('YYYY/MM/DD'),
        coverImgUrl: item.coverPhoto?.image?.resizedTargets?.mobile?.url,
        pdfLink: item?.magazine?.url,
      }
    },
    setListData(response = {}) {
      let listData = response.items ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData.push(...listData)
    },
    handleDownloadLinkClick() {
      this.$ga.event({
        eventCategory: 'magazine',
        eventAction: 'click',
        eventLabel: 'download magazine',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 48px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    padding: 60px 0 0 0;
  }

  &__current-featured-magazine-wrapper {
    margin: 32px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 48px 0 0 0;
    }
  }
  &__magazine-showcase-list-wrapper {
    margin: 48px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 109px 0 0 0;
    }
    & + & {
      margin: 0;
    }
  }
}

.current-featured-magazine-wrapper {
  padding: 0 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  @include media-breakpoint-up(md) {
    max-width: 528px;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1068px;
    flex-direction: row;
  }

  &__magazine {
    & + & {
      margin: 24px 0 0 0;
      @include media-breakpoint-up(xl) {
        margin: 0 0 0 24px;
      }
    }
  }
}

.title {
  font-size: 28px;
  font-weight: 500;
  color: #4a4a4a;
  @include media-breakpoint-up(xl) {
    font-size: 32px;
  }
}

.magazine-showcase-list-wrapper {
  background-color: #f2f2f2;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 20px;
  &__magazine-showcase-list {
    margin: 32px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 48px 0 0 0;
    }
  }
  @include media-breakpoint-up(md) {
    padding: 48px;
  }
  @include media-breakpoint-up(xl) {
    padding: 48px 0;
  }
}

.magazine-showcase-list {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, minmax(132px, 1fr));
  grid-auto-rows: auto;
  gap: 24px 16px;
  @include media-breakpoint-up(md) {
    grid-template-columns: repeat(auto-fit, minmax(144px, 1fr));
    gap: 40px 32px;
  }
  @include media-breakpoint-up(xl) {
    gap: 60px 48px;
    max-width: 1104px;
  }
}
</style>
