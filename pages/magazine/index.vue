<template>
  <div class="page-wrapper">
    <ClientOnly>
      <div v-if="!isMagazinesVisible">
        <h1 class="upgrade-title">電子雜誌</h1>
        <UiMembershipUpgradeToPremium
          :messageTitle="'加入Premium會員，免費閱覽最新電子版週刊'"
          @upgrade="handleUpgrade"
        />
      </div>
      <section v-else class="page">
        <h1 class="title">當期<span class="blue">動態雜誌</span></h1>
        <div
          class="page__current-featured-magazine-wrapper current-featured-magazine-wrapper"
        >
          <UiMagazineFeatured
            v-if="magazineFeatured[0]"
            class="current-featured-magazine-wrapper__magazine"
            :coverImgUrl="magazineFeatured[0].coverImgUrl"
            :label="magazineFeatured[0].issue"
            :title="magazineFeatured[0].title"
            :downloadLink="magazineFeatured[0].pdfLink"
            :onlineLink="magazineFeatured[0].onlineLink"
            @downloadLinkClick="handleDownloadLinkClick"
          />
          <UiMagazineFeatured
            v-if="magazineFeatured[1]"
            class="current-featured-magazine-wrapper__magazine"
            :coverImgUrl="magazineFeatured[1].coverImgUrl"
            :label="magazineFeatured[1].issue"
            :title="magazineFeatured[1].title"
            :downloadLink="magazineFeatured[1].pdfLink"
            :onlineLink="magazineFeatured[1].onlineLink"
            @downloadLinkClick="handleDownloadLinkClick"
          />
        </div>
        <section
          class="page__magazine-showcase-list-wrapper magazine-showcase-list-wrapper"
        >
          <h1 class="title">近期<span class="blue">動態雜誌</span></h1>
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
                :onlineLink="item.onlineLink"
                :isMobile="!isViewportWidthUpSm"
                @downloadLinkClick="handleDownloadLinkClick"
              />
            </li>
          </ol>
        </section>
        <section
          class="page__magazine-showcase-list-wrapper magazine-showcase-list-wrapper magazine-showcase-list-wrapper--white"
        >
          <h1 class="title">購買線上雜誌</h1>
          <div
            class="magazine-showcase-list-wrapper__platform-links platform-links"
          >
            <div class="platform-links__row">
              <a
                class="logo-wrapper"
                href="https://bookstore.emome.net/Searchs/finish/keyword:%E9%8F%A1%E9%80%B1%E5%88%8A"
                target="_blank"
                rel="noreferrer noopener"
              >
                <SvgPlatformLogoHami />
              </a>
              <a
                class="logo-wrapper"
                href="https://mybook.taiwanmobile.com/search?publisher=%E9%8F%A1%E9%80%B1%E5%88%8A"
                target="_blank"
                rel="noreferrer noopener"
              >
                <SvgPlatformLogoMybook />
              </a>
              <a
                class="logo-wrapper"
                href="https://www.pubu.com.tw/magazine-list/%E9%8F%A1%E9%80%B1%E5%88%8A-773"
                target="_blank"
                rel="noreferrer noopener"
              >
                <SvgPlatformLogoPubu />
              </a>
            </div>
            <div class="platform-links__row">
              <a
                class="logo-wrapper"
                href="https://readmoo.com/mag/248?header_v2_subject_category"
                target="_blank"
                rel="noreferrer noopener"
              >
                <SvgPlatformLogoReadmoo />
              </a>
              <div class="logo-wrapper">
                <SvgPlatformLogoKono />
                <div class="kono-links-wrapper">
                  <p>
                    <a
                      class="kono-link"
                      target="_blank"
                      rel="noreferrer noopener"
                      href="https://www.thekono.com/magazines/mirrormedia_a"
                    >
                      <span>A本</span>
                    </a>
                    <span>|</span>
                    <a
                      class="kono-link"
                      target="_blank"
                      rel="noreferrer noopener"
                      href="https://www.thekono.com/magazines/mirrormedia_b"
                    >
                      <span>B本</span>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
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
              <UiMagazineShowcaseItemSpecial
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
    </ClientOnly>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from '~/utils/dayjs'
import UiMagazineFeatured from '~/components/UiMagazineFeatured.vue'
import UiMagazineShowcaseItem from '~/components/UiMagazineShowcaseItem.vue'
import UiMagazineShowcaseItemSpecial from '~/components/UiMagazineShowcaseItemSpecial.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import SvgPlatformLogoHami from '~/assets/magazine-platform-logo-hami.svg?inline'
import SvgPlatformLogoMybook from '~/assets/magazine-platform-logo-mybook.svg?inline'
import SvgPlatformLogoPubu from '~/assets/magazine-platform-logo-pubu.svg?inline'
import SvgPlatformLogoReadmoo from '~/assets/magazine-platform-logo-readmoo.svg?inline'
import SvgPlatformLogoKono from '~/assets/magazine-platform-logo-kono.svg?inline'

import fetchListAndLoadmore from '~/mixins/fetch-list-and-loadmore'
import { shouldIdentifyMarketingByEmail } from '~/middleware/utils'
import UiMembershipUpgradeToPremium from '~/components/UiMembershipUpgradeToPremium.vue'

export default {
  components: {
    UiMembershipUpgradeToPremium,
    UiMagazineFeatured,
    UiMagazineShowcaseItem,
    UiMagazineShowcaseItemSpecial,
    UiInfiniteLoading,
    SvgPlatformLogoHami,
    SvgPlatformLogoMybook,
    SvgPlatformLogoPubu,
    SvgPlatformLogoReadmoo,
    SvgPlatformLogoKono,
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
  data() {
    return {
      listData: [],
    }
  },
  computed: {
    ...mapGetters({
      isViewportWidthUpSm: 'viewport/isViewportWidthUpSm',
    }),
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

    isMagazinesVisible() {
      const memberType =
        this.$store.state['membership-subscribe'].basicInfo?.type ?? 'none'
      return (
        shouldIdentifyMarketingByEmail(this.$store) ||
        memberType === 'marketing' ||
        memberType === 'subscribe_monthly' ||
        memberType === 'subscribe_yearly'
      )
    },
  },

  async beforeMount() {
    if (!this.isMagazinesVisible) {
      return
    }
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
  methods: {
    mapDataToComponentProps(item) {
      return {
        id: item.id,
        type: item.type,
        title: item.title,
        issue: item.issue,
        publishedDate: dayjs.utc(item.publishedDate).format('YYYY/MM/DD'),
        coverImgUrl: item.coverPhoto?.image?.resizedTargets?.mobile?.url,
        pdfLink: item?.magazine?.url,
        onlineLink:
          this.getMagazinePdfLinkByIssue(item.issue) ?? item?.magazine?.url,
      }
    },
    getMagazinePdfLinkByIssue(issue) {
      const issueTransformed = transformIssue(issue)
      return issueTransformed ? `/magazine/${issueTransformed}` : null

      function transformIssue(issue) {
        const regexp = /《鏡週刊》(\d+)期-(\w+)本/
        if (!regexp.test(issue)) {
          return
        }
        const result = issue.match(regexp)
        const isRegexpMatchFail = !result[2] || !result[1]
        if (isRegexpMatchFail) {
          return
        }
        const bookOrder = result[2]
        const issueNumber = result[1]
        return `Book_${bookOrder}/${bookOrder}${issueNumber}-Publish`
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

    handleUpgrade() {
      window.location.assign('/subscribe')
    },
  },
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 48px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    padding: 24px 0 48px 0;
  }
}

.upgrade-title {
  font-size: 22px;
  line-height: 30.8px;
  color: rgba(0, 0, 0, 0.66);
  margin-bottom: 12px;
  @include media-breakpoint-up(sm) {
    font-size: 24px;
    line-height: 34px;
  }
}

.page {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.blue {
  color: #054f77;
}

.magazine-showcase-list-wrapper {
  background-color: #f2f2f2;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px 20px;
  @include media-breakpoint-up(md) {
    padding: 48px;
  }
  @include media-breakpoint-up(xl) {
    padding: 48px 0;
  }
  &--white {
    background-color: white;
  }

  &__magazine-showcase-list,
  &__platform-links {
    margin: 32px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 48px 0 0 0;
    }
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

.platform-links {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @include media-breakpoint-up(xl) {
    flex-direction: row;
    align-items: flex-start;
  }

  &__row {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    & + & {
      margin: 24px 0 0 0;
      @include media-breakpoint-up(xl) {
        margin: 0 0 0 24px;
      }
    }
    @include media-breakpoint-up(md) {
      flex-direction: row;
      align-items: flex-start;
    }
  }
}

.logo-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & + & {
    margin: 24px 0 0 0;
    @include media-breakpoint-up(md) {
      margin: 0 0 0 24px;
    }
  }
}

.kono-links-wrapper {
  margin: 8px 0 0 0;
  font-size: 16px;
  line-height: 150%;
  color: #4a4a4a;
}

.kono-link {
  border-bottom: 1px solid transparent;
  &:hover {
    border-bottom: 1px solid #4a4a4a;
  }
}
</style>
