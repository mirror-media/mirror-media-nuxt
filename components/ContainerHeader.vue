<template>
  <header :class="{ fixed: shouldFixHeader }">
    <div class="header-top-layer">
      <button
        type="button"
        class="menu-icon"
        aria-label="menu-icon"
        @click="handleClickMenuIcon"
      />

      <ClientOnly>
        <ContainerMembershipMemberIcon class="member-icon-mobile" />
      </ClientOnly>

      <div class="logo-wrapper">
        <a href="/" class="logo logo--site" @click="sendHeaderGa('logo')">
          <img :src="require(`~/assets/premium-logo.svg`)" :alt="SITE_TITLE" />
        </a>

        <ClientOnly>
          <UiEventLogo
            v-if="shouldOpenEventLogo"
            v-show="!shouldFixHeader"
            class="logo"
            :eventLogo="eventLogo"
            @sendGa="handleSendGa"
          />

          <ContainerGptAd
            v-show="shouldShowGptLogo"
            pageKey="global"
            adKey="RWD_LOGO"
            class="logo"
            @slotRenderEnded="handleLogoAdRenderEnded"
          />
        </ClientOnly>
      </div>

      <div class="header-search">
        <div class="header-search__and-magazine">
          <UiSearchBarWrapper
            class="header__search-bar-wrapper"
            @sendGa="handleSendGa"
          />
          <UiSubscribeMagazineEntrance />
        </div>
        <ClientOnly>
          <ContainerMembershipMemberIcon class="member-icon-desktop" />
        </ClientOnly>

        <UiPromotionList
          class="header__promotion-list"
          :links="PROMOTION_LINKS"
          eventCategory="header"
          @sendGa="handleSendGa"
        />
      </div>
    </div>

    <nav class="header-nav">
      <UiHeaderNavSection
        :sections="displayedHeaderData"
        :currentSectionName="sectionName"
        :currentCategoryName="currentCategoryName"
        :partners="partners"
        @sendGa="handleSendGa"
      />
      <UiHeaderNavTopic
        :topics="topics"
        :subBrands="SUB_BRAND_LINKS"
        @sendGa="handleSendGa"
      />
    </nav>

    <ClientOnly>
      <transition name="slide">
        <UiSidebar
          v-if="shouldOpenSidebar"
          :topics="topics"
          :sections="displayedHeaderData"
          :partners="partners"
          :subBrands="SUB_BRAND_LINKS"
          :promotions="PROMOTION_LINKS"
          :socialMedia="SOCIAL_MEDIA_LINKS"
          @close="handleSidebarClose"
          @sendGa="handleSendGa"
        />
      </transition>
    </ClientOnly>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

import UiEventLogo from './UiEventLogo.vue'
import UiSearchBarWrapper from './UiSearchBarWrapper.vue'
import UiPromotionList from './UiPromotionList.vue'
import UiHeaderNavSection from './UiHeaderNavSection.vue'
import UiHeaderNavTopic from './UiHeaderNavTopic.vue'
import UiSidebar from './UiSidebar.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerMembershipMemberIcon from '~/components/ContainerMembershipMemberIcon.vue'
import UiSubscribeMagazineEntrance from '~/components/UiSubscribeMagazineEntrance.vue'

import {
  SUB_BRAND_LINKS,
  SOCIAL_MEDIA_LINKS,
  PROMOTION_LINKS,
  SITE_TITLE,
} from '~/constants/index'

let headerHight = 0

const DEFAULT_NORMAL_SECTIONS_DATA = [
  {
    order: 1,
    type: 'section',
    slug: 'member',
    name: '會員專區',
    categories: [
      { id: '49', slug: 'somebody', name: '一鏡到底', isMemberOnly: true },
      { id: '51', slug: 'truth', name: '心內話', isMemberOnly: true },
      { id: '50', slug: 'world', name: '鏡相人間', isMemberOnly: true },
      { id: '52', slug: 'mogul', name: '財經人物', isMemberOnly: true },
      { id: '19', slug: 'money', name: '理財', isMemberOnly: true },
      { id: '94', slug: 'timesquare', name: '時代現場', isMemberOnly: true },
      { id: '25', slug: 'celebrity', name: '鏡大咖', isMemberOnly: true },
      { id: '27', slug: 'column', name: '影劇專欄', isMemberOnly: true },
      { id: '1', slug: 'food', name: '美食焦點', isMemberOnly: true },
      { id: '2', slug: 'traveltaiwan', name: '旅行台灣', isMemberOnly: true },
      { id: '7', slug: 'seetheworld', name: '看見世界', isMemberOnly: true },
      { id: '8', slug: 'kitchenplay', name: '廚房密技', isMemberOnly: true },
      { id: '35', slug: 'wine', name: '好酒情報', isMemberOnly: true },
      { id: '112', slug: 'dig', name: '完整全文', isMemberOnly: false },
    ],
  },
  {
    order: 2,
    type: 'category',
    slug: 'news',
    name: '焦點',
    isMemberOnly: false,
    sections: ['news'],
  },
  {
    order: 3,
    type: 'section',
    slug: 'entertainment',
    name: '娛樂',
    categories: [
      { id: '24', slug: 'latestnews', name: '娛樂頭條', isMemberOnly: false },
      { id: '61', slug: 'rookie', name: '試鏡間', isMemberOnly: false },
      { id: '62', slug: 'fashion', name: '穿衣鏡', isMemberOnly: false },
      { id: '63', slug: 'madam', name: '蘭蘭夫人', isMemberOnly: false },
      {
        id: '64',
        slug: 'superstar',
        name: '我眼中的大明星',
        isMemberOnly: false,
      },
      { id: '36', slug: 'insight', name: '娛樂透視', isMemberOnly: false },
      { id: '48', slug: 'comic', name: '動漫遊戲', isMemberOnly: false },
    ],
  },
  {
    order: 4,
    type: 'category',
    slug: 'political',
    name: '政治',
    isMemberOnly: false,
    sections: ['news'],
  },
  {
    order: 5,
    type: 'category',
    slug: 'business',
    name: '財經',
    isMemberOnly: false,
    sections: ['businessmoney'],
  },
  {
    order: 6,
    type: 'category',
    slug: 'city-news',
    name: '社會',
    isMemberOnly: false,
    sections: ['news'],
  },
  {
    order: 8,
    type: 'category',
    slug: 'global',
    name: '國際要聞',
    isMemberOnly: false,
    sections: ['news', 'international'],
  },
  {
    order: 9,
    type: 'section',
    slug: 'carandwatch',
    name: '汽車鐘錶',
    categories: [
      { id: '56', slug: 'car_focus', name: '車壇焦點', isMemberOnly: false },
      {
        id: '57',
        slug: 'car_features',
        name: '鏡車專題',
        isMemberOnly: false,
      },
      {
        id: '58',
        slug: 'test_drives',
        name: '靚俥試駕',
        isMemberOnly: false,
      },
      { id: '59', slug: 'pit_zone', name: '鏡車經', isMemberOnly: false },
      { id: '11', slug: 'watchfocus', name: '錶壇焦點', isMemberOnly: false },
      {
        id: '12',
        slug: 'watchfeature',
        name: '鐘錶專題',
        isMemberOnly: false,
      },
      { id: '15', slug: 'blog', name: '編輯幕後', isMemberOnly: false },
      {
        id: '107',
        slug: 'newwatches2021',
        name: '新錶2021',
        isMemberOnly: false,
      },
      { id: '111', slug: 'luxury', name: '奢華誌', isMemberOnly: false },
      {
        id: '114',
        slug: 'newwatches2022',
        name: '新錶2022',
        isMemberOnly: false,
      },
      {
        id: '115',
        slug: 'newwatches2023',
        name: '新錶2023',
        isMemberOnly: false,
      },
    ],
  },
  {
    order: 10,
    type: 'section',
    slug: 'mafalda',
    name: '瑪法達',
    categories: [],
  },
]

export default {
  name: 'ContainerHeader',
  components: {
    UiEventLogo,
    UiSearchBarWrapper,
    UiPromotionList,
    UiHeaderNavSection,
    UiHeaderNavTopic,
    UiSidebar,
    ContainerGptAd,
    ContainerMembershipMemberIcon,
    UiSubscribeMagazineEntrance,
  },

  props: {
    currentSectionName: {
      type: String,
      default: undefined,
    },
    currentCategoryName: {
      type: String,
      default: undefined,
    },
  },
  async fetch() {
    try {
      const res = await this.$fetchHeadersNew()
      this.headerData = res.headers
    } catch (error) {
      console.error(error)
      this.headerData = []
    }
  },

  data() {
    return {
      shouldFixHeader: false,
      SITE_TITLE,
      headerData: [],
      eventLogo: {},
      now: new Date(),
      intervalIdOfUpdateNow: undefined,
      hasGptLogo: false,

      defaultOption: { title: '全部類別' },

      shouldOpenSidebar: false,
      PROMOTION_LINKS,
      SOCIAL_MEDIA_LINKS,
      SUB_BRAND_LINKS,
    }
  },
  computed: {
    ...mapGetters({
      sections: 'sections/displayedSections',
      searchedSections: 'sections/sections',
      getSectionByCategoryName: 'sections/getSectionByCategoryName',
      partners: 'partners/displayedPartners',
      topics: 'topics/displayedTopics',
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),
    displayedHeaderData() {
      const formatSectionItem = (section) => {
        const sectionWithMagazine = insertMagazineIntoSectionMember(section)
        const sectionsAndCategoriesWithHref =
          getSectionAndCategoryHref(sectionWithMagazine)
        return sectionsAndCategoriesWithHref

        function insertMagazineIntoSectionMember(section) {
          if (section.slug === 'member') {
            return {
              ...section,
              categories: [
                {
                  id: '7a7482edb739242537f11e24760d2c79', // hash for ensure it is unique from other category, no other usage.
                  slug: 'magazine',
                  name: '動態雜誌',
                  isMemberOnly: false,
                },
                ...section.categories,
              ],
            }
          } else if (section.slug === 'life') {
            return {
              ...section,
              categories: [
                ...section.categories,
                {
                  id: '306dac073da6dc1ddb4e34c228035915', // hash for ensure it is unique from other category, no other usage.
                  slug: 'warmlife',
                  name: '暖流',
                  isMemberOnly: false,
                },
              ],
            }
          }
          return { ...section }
        }

        function getSectionAndCategoryHref(section) {
          return {
            ...section,
            href: getSectionHref(section.slug),
            categories: getCategoryInSectionWithHref(section),
          }

          function getSectionHref(sectionSlug) {
            if (sectionSlug === 'member') {
              return `/premiumsection/${sectionSlug}`
            } else {
              return `/section/${sectionSlug}`
            }
          }

          function getCategoryInSectionWithHref(section) {
            const { categories = [] } = section
            return categories.map((category) => {
              return {
                ...category,
                href: getCategoryHref(section.slug, category.slug),
              }
            })

            /**
             * @param {HeadersDataSection['slug']} sectionSlug
             * @param {import('./nav-sections').CategoryInHeadersDataSection['slug']} categorySlug
             * @returns {string}
             */
            function getCategoryHref(sectionSlug, categorySlug) {
              if (sectionSlug === 'videohub') {
                return `/video_category/${categorySlug}`
              }
              if (categorySlug === 'magazine') {
                return '/magazine/'
              }
              if (sectionSlug === 'life' && categorySlug === 'warmlife') {
                return '/externals/warmlife'
              }
              return `/category/${categorySlug}`
            }
          }
        }
      }

      const formatCategoryItem = (category) => {
        return getSectionAndCategoryHref(category)

        function getSectionAndCategoryHref(section) {
          return {
            ...section,
            href: getCategoryHref(section.sections, section.slug),
          }

          function getCategoryHref(sections, categorySlug) {
            if (
              sections &&
              sections.length &&
              sections.some((section) => section === 'videohub')
            ) {
              return `/video_category/${categorySlug}`
            }
            return `/category/${categorySlug}`
          }
        }
      }

      const formatSections = (sectionsData) => {
        const _sectionsData =
          sectionsData && sectionsData.length
            ? sectionsData
            : DEFAULT_NORMAL_SECTIONS_DATA
        const formattedSectionData = _sectionsData.map((item) => {
          switch (item.type) {
            case 'section':
              return formatSectionItem(item)
            case 'category':
              return formatCategoryItem(item)
            default:
              return null
          }
        })

        return formattedSectionData
      }
      return formatSections(this.headerData)
    },
    sectionName() {
      let sectionName

      {
        const { path } = this.$route

        if (path.startsWith('/story/')) {
          return this.currentSectionName
        }

        {
          const sec = '/section/'
          const cat = '/category/'

          if (path === '/') {
            sectionName = 'home'
          } else if (path.startsWith(sec)) {
            sectionName = removePrefix(path, sec)

            if (sectionName === 'topic') {
              return
            }
          } else if (path.startsWith(cat)) {
            const categoryName = removePrefix(path, cat)
            sectionName = this.getSectionByCategoryName(categoryName).name
          }
        }
      }

      return sectionName

      function removePrefix(str = '', prefix = '') {
        return str.slice(prefix.length)
      }
    },

    shouldOpenEventLogo() {
      // 當有 GPT Logo 時不應該出現 Event Logo
      if (!this.hasEventLogo || this.hasGptLogo) {
        return false
      }

      return this.isInThePeriodBetween(
        new Date(this.eventLogo.startDate),
        new Date(this.eventLogo.endDate)
      )
    },
    hasEventLogo() {
      return Object.keys(this.eventLogo).length > 0
    },
    shouldShowGptLogo() {
      return !this.isPremiumMember && this.hasGptLogo && !this.shouldFixHeader
    },
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
    },
  },
  watch: {
    isDesktopWidth() {
      if (!this.isDesktopWidth) {
        this.listenScrollToFixHeader()
      } else {
        this.cleanFixedHeader()
      }
    },
    '$route.fullPath'() {
      this.shouldOpenSidebar = false
    },
  },
  beforeMount() {
    this.fetchEventLogo()

    this.intervalIdOfUpdateNow = setInterval(this.updateNow, 1000)
  },

  mounted() {
    if (!this.isDesktopWidth) {
      this.listenScrollToFixHeader()
    }
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.handleFixHeader)

    clearInterval(this.intervalIdOfUpdateNow)
  },
  methods: {
    listenScrollToFixHeader() {
      headerHight = this.$el.offsetHeight
      this.handleFixHeader()
      window.addEventListener('scroll', this.handleFixHeader)
    },
    handleFixHeader() {
      this.shouldFixHeader = window.pageYOffset >= headerHight

      document.body.style.paddingTop = this.shouldFixHeader
        ? `${headerHight}px`
        : ''
    },
    cleanFixedHeader() {
      window.removeEventListener('scroll', this.handleFixHeader)

      this.shouldFixHeader = false
      document.body.style.paddingTop = ''
    },

    async fetchEventLogo() {
      const eventLogoResponse = await this.$fetchEvent({
        isFeatured: true,
        eventType: 'logo',
        maxResults: 1,
      })
      this.eventLogo = eventLogoResponse.items?.[0] ?? {}
    },
    isInThePeriodBetween(startTime, endTime) {
      return this.now >= startTime && this.now < endTime
    },
    updateNow() {
      this.now = new Date()
    },

    handleLogoAdRenderEnded(event) {
      this.hasGptLogo = !event.isEmpty
    },

    handleClickMenuIcon() {
      this.openSidebar()
      this.sendHeaderGa('menu open')
    },
    handleSidebarClose() {
      this.closeSidebar()
      this.sendHeaderGa('menu close')
    },
    openSidebar() {
      this.shouldOpenSidebar = true
    },
    closeSidebar() {
      this.shouldOpenSidebar = false
    },

    sendHeaderGa(eventLabel, eventAction = 'click') {
      this.$ga.event({
        eventCategory: 'header',
        eventAction,
        eventLabel,
      })
    },
    handleSendGa(param = {}) {
      this.$ga.event(param)
    },
  },
}
</script>

<style lang="scss" scoped>
$header-top-layer-width: 90%;
$header-top-layer-padding-x: math.div(100% - $header-top-layer-width, 2);
$menu-icon-width: 16px;
$logo-wrapper-margin-x: 8px;
$header-search-margin-right: 20px;
$share-wrapper-width: 70px;
$search-icon-width: 18px;
$search-field-arrow-width: 11px;

header {
  background: #204f74;
  z-index: 519;
  padding-bottom: 5px;
  position: relative;
  @include media-breakpoint-up(xl) {
    height: 160px;
  }

  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    .header-nav {
      display: none;
    }

    .header-search {
      margin-right: $header-search-margin-right;
    }

    .header__search-bar-wrapper::v-deep .search-bar .field {
      top: 76px;

      &::before {
        right: calc(
          #{$header-top-layer-padding-x} + #{$share-wrapper-width} + #{$header-search-margin-right} +
            #{math.div($search-icon-width - $search-field-arrow-width, 2)}
        );
      }
    }
  }
}

.header-top-layer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: $header-top-layer-width;
  max-width: 1024px;
  height: 71px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 33px;
  padding-bottom: 13px;
  @include media-breakpoint-up(md) {
    padding-top: 0px;
    padding-bottom: 0;
  }
  @include media-breakpoint-up(xl) {
    height: 70px;
  }
}
.menu-icon {
  flex-shrink: 0;
  width: $menu-icon-width;
  height: 10px;
  background-image: url(~assets/hamburger-white@2x.png);
  // background-size: 16px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  user-select: none;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}
.member-icon-mobile::v-deep {
  width: 26px;
  margin: 0 0 0 20px;
  @include media-breakpoint-up(xl) {
    display: none;
  }
  .logged-in-icon__icon path {
    fill: #fff;
  }
}
.member-icon-desktop {
  display: none;
  @include media-breakpoint-up(xl) {
    display: initial;
    width: 33px;
    height: 36px;
    margin: 0 10px 0 20px;
  }
}
.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(
    100% -
      (
        #{$menu-icon-width} + #{$search-icon-width} + #{$logo-wrapper-margin-x} *
          2
      )
  );
  @include media-breakpoint-up(xl) {
    justify-content: flex-start;
    width: auto;
  }
}
.logo {
  cursor: pointer;
  user-select: none;
  &::v-deep img {
    width: 74px;
    @include media-breakpoint-up(xl) {
      width: auto;
      height: 50px;
    }
  }
  + .logo {
    margin-left: 5px;
  }
}
.header-search {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  z-index: 529;
  &__and-magazine::v-deep {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    @include media-breakpoint-up(xl) {
      flex-direction: row;
    }

    .subscribe-magazine-entrance {
      background: #000000;
      color: #fff;

      @include media-breakpoint-up(xl) {
        display: block;
      }
    }

    .field {
      background-color: #d8d8d8;
      top: 76px;
      padding: 16px 24px;
      &::after {
        content: '';
        display: block;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 8px 16px 8px;
        border-color: transparent transparent #d8d8d8 transparent;
        position: absolute;
        top: -16px;
        right: calc(5vw);
        @include media-breakpoint-up(md) {
          right: calc(5vw + 20px);
        }
      }

      .search-bar-select {
        height: 32px;
      }

      .search-bar-input {
        height: 32px;
        margin-top: 16px;
        input {
          border-radius: 8px;
        }
      }
    }
  }
}

.header-search::v-deep {
  path {
    fill: #fff;
  }

  .more-icon {
    background-image: url(~assets/more_white@2x.png);
    background-position: center;
    background-repeat: no-repeat;
    width: 5px;
    height: 20px;
    background-size: inherit;
  }
}

.share-wrapper {
  display: flex;

  a {
    width: 30px;

    + a {
      margin-left: 10px;
    }
  }
}

.header__promotion-list {
  display: none;
  @include media-breakpoint-up(xl) {
    display: block;
  }
}
.header-nav::v-deep {
  height: 24px;
  .section {
    color: #fff !important;
    padding-top: 0;
    &::after {
      content: none !important;
    }
    @each $name, $color in $sections-color {
      &--#{$name}.active {
        color: $color !important;
      }
    }

    @include media-breakpoint-up(md) {
      padding: 0;
      border-top-color: #000 !important;
      @each $name, $color in $sections-color {
        &--#{$name} {
          &:hover {
            background: inherit !important;
            h2 {
              color: $color !important;
            }
          }
          & .section__dropdown a:hover {
            background-color: $color !important;
          }
        }
      }
    }
    &--member {
      background: inherit !important;
    }
    &__dropdown {
      z-index: 20;
      color: white;
    }
  }

  .topic-item {
    border-bottom: 3px solid #000 !important;
    position: relative;
    &::before {
      content: '';
      height: 3px;
      width: 100px;
      background-color: #000;
      display: block;
      position: absolute;
      bottom: 0;
      left: 0;
      transform: translate(-100%, 100%);
    }
    &--normal {
      &::before {
        display: none !important;
      }
      &:hover {
        background-color: #004dbc !important;
      }
    }
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.45s;
}
.slide-enter,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
