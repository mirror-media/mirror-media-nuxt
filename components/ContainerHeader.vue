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
          <img
            :src="
              require(`~/assets/${shouldFixHeader ? 'logo@2x' : 'logo'}.png`)
            "
            :alt="SITE_TITLE"
          />
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
        <UiSearchBarWrapper
          class="header__search-bar-wrapper"
          :options="options"
          @sendGa="handleSendGa"
        />

        <ClientOnly>
          <ContainerMembershipMemberIcon class="member-icon-desktop" />
        </ClientOnly>

        <UiOthersList
          class="others-list"
          :links="OTHER_LINKS"
          eventCategory="header"
          @sendGa="handleSendGa"
        />
      </div>

      <ClientOnly>
        <div v-if="shouldFixHeader" class="share-wrapper">
          <UiShareFb />
          <UiShareLine />
        </div>
      </ClientOnly>
    </div>

    <nav class="header-nav">
      <UiHeaderNavSection
        :sections="sections"
        :currentSectionName="sectionName"
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
          :sections="sections"
          :partners="partners"
          :subBrands="SUB_BRAND_LINKS"
          :others="OTHER_LINKS"
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
import UiOthersList from './UiOthersList.vue'
import UiHeaderNavSection from './UiHeaderNavSection.vue'
import UiHeaderNavTopic from './UiHeaderNavTopic.vue'
import UiSidebar from './UiSidebar.vue'
import UiShareFb from '~/components/UiShareFb.vue'
import UiShareLine from '~/components/UiShareLine.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerMembershipMemberIcon from '~/components/ContainerMembershipMemberIcon.vue'

import {
  SUB_BRAND_LINKS,
  SOCIAL_MEDIA_LINKS,
  OTHER_LINKS,
  SITE_TITLE,
} from '~/constants/index'

let headerHight = 0

export default {
  name: 'ContainerHeader',
  components: {
    UiEventLogo,
    UiSearchBarWrapper,
    UiOthersList,
    UiHeaderNavSection,
    UiHeaderNavTopic,
    UiSidebar,
    UiShareFb,
    UiShareLine,
    ContainerGptAd,
    ContainerMembershipMemberIcon,
  },

  props: {
    currentSectionName: {
      type: String,
      default: undefined,
    },
  },

  data() {
    return {
      shouldFixHeader: false,
      SITE_TITLE,

      eventLogo: {},
      now: new Date(),
      intervalIdOfUpdateNow: undefined,
      hasGptLogo: false,

      defaultOption: { title: '全部類別' },

      shouldOpenSidebar: false,
      OTHER_LINKS,
      SOCIAL_MEDIA_LINKS,
      SUB_BRAND_LINKS,
    }
  },
  computed: {
    ...mapGetters({
      sections: 'sections/displayedSections',
      gainSectionByCategoryName: 'sections/gainSectionByCategoryName',
      partners: 'partners/displayedPartners',
      topics: 'topics/displayedTopics',
      isDesktopWidth: 'viewport/isViewportWidthUpXl',
    }),

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

            sectionName = this.gainSectionByCategoryName(categoryName).name
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
      return this.hasGptLogo && !this.shouldFixHeader
    },

    options() {
      const sections = this.sections.filter(
        (section) => section.name !== 'videohub'
      )
      return [this.defaultOption, ...sections]
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
$header-top-layer-padding-x: (100% - $header-top-layer-width) / 2;
$menu-icon-width: 24px;
$logo-wrapper-margin-x: 8px;
$header-search-margin-right: 20px;
$share-wrapper-width: 70px;
$search-icon-width: 18px;
$search-field-arrow-width: 11px;

header {
  background-color: #f5f5f5;
  z-index: 519;
  position: relative;

  &.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    .header-top-layer {
      height: 50px;
    }

    .logo-wrapper {
      width: auto;
      margin-right: auto;
      margin-left: 10px;
    }

    .logo--site img {
      width: 30px;
    }

    .header-search {
      margin-right: $header-search-margin-right;
    }

    .header__search-bar-wrapper::v-deep .search-bar .field {
      top: 50px;

      &::before {
        right: calc(
          #{$header-top-layer-padding-x} + #{$share-wrapper-width} + #{$header-search-margin-right} +
            #{($search-icon-width - $search-field-arrow-width) / 2}
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
  height: 90px;
  margin-left: auto;
  margin-right: auto;
  @include media-breakpoint-up(xl) {
    height: 70px;
  }
}
.menu-icon {
  flex-shrink: 0;
  width: $menu-icon-width;
  height: 40px;
  background-image: url(~assets/hamburger@2x.png);
  background-size: 24px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  user-select: none;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}
.member-icon-mobile {
  width: 30px;
  margin: 0 0 0 10px;
  @include media-breakpoint-up(xl) {
    display: none;
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
    width: 95px;
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

.others-list {
  display: none;
  @include media-breakpoint-up(xl) {
    display: block;
  }
}
.header-nav {
  box-shadow: 0 2px 1px rgba(#000, 0.2);
  @include media-breakpoint-up(xl) {
    box-shadow: 0 0 5px #ccc;
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
