<template>
  <section class="section">
    <UIVideoLatest :items="latest" class="section__latest" />
    <div class="section__bottom-wrapper">
      <UIVideoPopular :items="latest" class="section__popular" />
      <UIVideoSubscriptions class="section__subscriptions" />
      <div class="section__categories-wrapper">
        <UIVideoCategory
          v-for="category in categories"
          :key="`video-category-${category.id}`"
          :category="category"
          :items="latest"
          class="section__category"
        />
      </div>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import UIVideoCategory from '~/components/UIVideoCategory.vue'
import UIVideoLatest from '~/components/UIVideoLatest.vue'
import UIVideoPopular from '~/components/UIVideoPopular.vue'
import UIVideoSubscriptions from '~/components/UIVideoSubscriptions.vue'

export default {
  name: 'SectionVideohub',
  components: {
    UIVideoCategory,
    UIVideoLatest,
    UIVideoPopular,
    UIVideoSubscriptions,
  },
  data() {
    return {
      listDataLatest: [
        {
          snippet: {
            title:
              '創辦人魏應充3年投入850萬  頂新和德接棒未來 扎根台中基層棒球｜鏡週刊',
            resourceId: {
              videoId: 'TX1NNUXnETY',
            },
            thumbnails: {
              standard: {
                url: 'https://i.ytimg.com/vi/cysgZvvBb9Y/sddefault.jpg',
              },
            },
          },
        },
        {
          snippet: {
            title:
              '【新聞內幕】多名女網友受害 揭博士版李宗瑞偷拍性愛片｜鏡週刊',
            resourceId: {
              videoId: 'l7i2a7vcMLs',
            },
            thumbnails: {
              standard: {
                url: 'https://i.ytimg.com/vi/wr8bqzc1tSA/sddefault.jpg',
              },
            },
          },
        },
        {
          snippet: {
            title:
              '【財經封面】郭台銘有條件撥款 管中閔改造台大癌醫自救｜鏡週刊',
            resourceId: {
              videoId: 'wu5eO8p2GbI',
            },
            thumbnails: {
              standard: {
                url: 'https://i.ytimg.com/vi/Kb4SNTJ0tf0/sddefault.jpg',
              },
            },
          },
        },
        {
          snippet: {
            title: '螢幕初戀吳朋奉驟逝 苗可麗哽咽：來世再見｜鏡週刊 娛樂即時',
            resourceId: {
              videoId: 'J0a0T-MflZk',
            },
            thumbnails: {
              standard: {
                url: 'https://i.ytimg.com/vi/0uUUdG5Y-sc/sddefault.jpg',
              },
            },
          },
        },
        {
          snippet: {
            title:
              '【鏡爆頭條】甜美女神對金主過河拆橋 舒子晨撇撂黑衣人嗆聲解約｜鏡週刊',
            resourceId: {
              videoId: 'Fopva7j07QM',
            },
            thumbnails: {
              standard: {
                url: 'https://i.ytimg.com/vi/j_8JhgrbhM0/sddefault.jpg',
              },
            },
          },
        },
      ],
    }
  },
  computed: {
    ...mapState({
      sections: (state) => state.sections.data.items ?? [],
    }),
    categories() {
      return this.sections.find(this.isThisSection).categories ?? []
    },
    // temporary usage
    latest() {
      return this.listDataLatest.map((item) => ({
        videoId: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnails: item.snippet.thumbnails.standard.url,
      }))
    },
  },
  methods: {
    isThisSection(section) {
      const currentSectionName = this.$route.path.split('/section/')[1]
      return section.name === currentSectionName
    },
  },
}
</script>
<style lang="scss" scoped>
.section {
  > * {
    @include media-breakpoint-up(xl) {
      width: 1024px;
      margin-left: auto;
      margin-right: auto;
    }
  }
  &__latest {
    @include media-breakpoint-up(xl) {
      padding: 0 0 53px 0;
    }
  }
  &__bottom-wrapper {
    @include media-breakpoint-up(xl) {
      display: flex;
      flex-wrap: wrap;
    }
  }
  &__popular,
  &__categories-wrapper {
    @include media-breakpoint-up(xl) {
      margin: 30px 0 65px;
    }
  }
  &__popular {
    @include media-breakpoint-up(xl) {
      order: 1;
    }
  }
  &__subscriptions {
    @include media-breakpoint-up(xl) {
      order: 0;
      width: 100vw;
      margin: 0 calc((-100vw + 1024px) / 2);
    }
  }
  &__categories-wrapper {
    padding: 0 0 29px;
    @include media-breakpoint-up(xl) {
      order: 2;
      flex: 1;
      padding: 0 0 0 39px;
    }
  }
  &__category {
    & + .section__category {
      border-top: 1px solid #979797;
      @include media-breakpoint-up(xl) {
        margin-top: 30px;
        border-top: none;
      }
    }
  }
}
</style>
