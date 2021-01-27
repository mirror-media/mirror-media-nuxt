<template>
  <section class="page">
    <h1 class="title">當期雜誌</h1>
    <div
      class="page__current-featured-magazine-wrapper current-featured-magazine-wrapper"
    >
      <UiMagazineFeatured
        :coverImgUrl="magazineFeatured.coverImgUrl"
        :label="magazineFeatured.issue"
        :title="magazineFeatured.title"
        :descriptions="magazineFeatured.descriptions"
        :downloadLink="magazineFeatured.pdfLink"
      />
    </div>
    <section
      class="page__magazine-showcase-list-wrapper magazine-showcase-list-wrapper"
    >
      <h1 class="title">所有期數</h1>
      <ol
        class="magazine-showcase-list-wrapper__magazine-showcase-list magazine-showcase-list"
      >
        <li
          v-for="item in magazineShowcases"
          :key="item.id"
          class="magazine-showcase-list__list-item magazine-showcase-list-item"
        >
          <UiMagazineShowcaseItem
            :coverImgUrl="item.coverImgUrl"
            :label="item.publishedDate"
            :title="item.issue"
            :downloadLink="item.pdfLink"
          />
        </li>
      </ol>
    </section>
  </section>
</template>

<script>
import _ from 'lodash'
import dayjs from 'dayjs'
import UiMagazineFeatured from '~/components/UiMagazineFeatured.vue'
import UiMagazineShowcaseItem from '~/components/UiMagazineShowcaseItem.vue'

export default {
  components: {
    UiMagazineFeatured,
    UiMagazineShowcaseItem,
  },
  middleware: ['authenticate'],
  async fetch() {
    const response = await this.$fetchMagazines({
      maxResults: 25,
      sort: '-publishedDate',
    })
    this.setListData(response)
  },
  data() {
    return {
      listData: [],
    }
  },
  computed: {
    magazineFeatured() {
      return this.listData[0]
    },
    magazineShowcases() {
      return _.drop(this.listData)
    },
  },
  methods: {
    mapDataToComponentProps(item) {
      return {
        id: item.id,
        title: item.title,
        issue: item.issue,
        publishedDate: dayjs(item.publishedDate).format('YYYY/MM/DD'),
        descriptions: getDescriptionsUnstyled(item),
        coverImgUrl: item.coverPhoto?.image?.resizedTargets?.mobile?.url,
        pdfLink: item?.magazine?.url,
      }

      function getDescriptionsUnstyled(item) {
        const data = item?.description?.apiData ?? []
        return data
          .filter((paragraph) => paragraph.type === 'unstyled')
          .map((paragraph) => paragraph?.content?.[0] ?? '')
      }
    },
    setListData(response = {}) {
      let listData = response.items ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData.push(...listData)
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
  &__current-featured-magazine-wrapper {
    margin: 24px 0 0 0;
  }
  &__magazine-showcase-list-wrapper {
    margin: 48px 0 0 0;
  }
}

.current-featured-magazine-wrapper {
  padding: 0 20px;
}

.title {
  font-size: 28px;
  font-weight: 400;
  color: #4a4a4a;
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
    margin: 24px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 40px 0 0 0;
    }
  }
  @include media-breakpoint-up(md) {
    padding: 32px 48px;
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
