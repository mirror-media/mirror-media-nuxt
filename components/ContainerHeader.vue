<template>
  <header>
    <div class="header-top-layer">
      <button type="button" class="menu-icon" @click="handleClickMenuIcon" />

      <div class="logo-wrapper">
        <nuxt-link to="/" class="logo" @click.native="sendHeaderGA('logo')">
          <img src="~/assets/logo.svg" :alt="SITE_TITLE" />
        </nuxt-link>

        <UIEventLogo
          v-if="shouldOpenEventLogo"
          class="logo"
          :eventLogo="eventLogo"
          @sendGA="handleSendGA"
        />
      </div>

      <div class="header-search">
        <UISearchBarWrapper :options="options" @sendGA="handleSendGA" />
        <UIOthersList
          class="others-list"
          :links="otherLinks"
          eventCategory="header"
          @sendGA="handleSendGA"
        />
      </div>
    </div>

    <nav class="header-nav">
      <UIHeaderNavSection
        :sections="sections"
        :partners="partners"
        @sendGA="handleSendGA"
      />
      <UIHeaderNavTopic
        :topics="topics"
        :subBrands="subBrandLinks"
        @sendGA="handleSendGA"
      />
    </nav>

    <transition name="slide">
      <UISidebar
        v-if="shouldOpenSidebar"
        :topics="topics"
        :sections="sections"
        :partners="partners"
        :subBrands="subBrandLinks"
        :others="otherLinks"
        :socialMedia="socialMediaLinks"
        @close="handleSidebarClose"
        @sendGA="handleSendGA"
      />
    </transition>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

import UIEventLogo from './UIEventLogo.vue'
import UISearchBarWrapper from './UISearchBarWrapper.vue'
import UIOthersList from './UIOthersList.vue'
import UIHeaderNavSection from './UIHeaderNavSection.vue'
import UIHeaderNavTopic from './UIHeaderNavTopic.vue'
import UISidebar from './UISidebar.vue'

import {
  SUB_BRAND_LINKS,
  SOCIAL_MEDIA_LINKS,
  OTHER_LINKS,
  SITE_TITLE,
} from '~/constants/index'

export default {
  name: 'ContainerHeader',
  components: {
    UIEventLogo,
    UISearchBarWrapper,
    UIOthersList,
    UIHeaderNavSection,
    UIHeaderNavTopic,
    UISidebar,
  },
  data() {
    return {
      eventLogo: {},
      current: new Date(),
      shouldOpenSidebar: false,
      defaultOption: { title: '全部類別' },
      SITE_TITLE,
    }
  },
  computed: {
    ...mapGetters({
      sections: 'sections/displayedSections',
      partners: 'partners/displayedPartners',
      topics: 'topics/displayedTopics',
    }),
    shouldOpenEventLogo() {
      const startTime = new Date(this.eventLogo.startDate)
      const endTime = new Date(this.eventLogo.endDate)

      return this.inTheTimeInterval(startTime, endTime, this.current)
    },
    options() {
      const sections = this.sections.filter(
        (section) => section.name !== 'videohub'
      )
      return [this.defaultOption, ...sections]
    },
    otherLinks() {
      return OTHER_LINKS
    },
    socialMediaLinks() {
      return SOCIAL_MEDIA_LINKS
    },
    subBrandLinks() {
      return SUB_BRAND_LINKS
    },
  },
  watch: {
    '$route.fullPath'() {
      this.shouldOpenSidebar = false
    },
  },
  beforeMount() {
    this.fetchOnClient()
  },
  methods: {
    fetchOnClient() {
      this.fetchEventLogo()
    },
    async fetchEventLogo() {
      const eventLogoResponse = await this.$fetchEvent({
        isFeatured: true,
        eventType: 'logo',
        maxResults: 1,
      })
      this.eventLogo = eventLogoResponse.items?.[0] ?? {}
    },
    inTheTimeInterval(startTime, endTime, targetTime) {
      return targetTime >= startTime && targetTime < endTime
    },
    handleClickMenuIcon() {
      this.openSidebar()
      this.sendHeaderGA('menu open')
    },
    handleSidebarClose() {
      this.closeSidebar()
      this.sendHeaderGA('menu close')
    },
    openSidebar() {
      this.shouldOpenSidebar = true
    },
    closeSidebar() {
      this.shouldOpenSidebar = false
    },
    sendHeaderGA(eventLabel, eventAction = 'click') {
      this.$ga.event({
        eventCategory: 'header',
        eventAction,
        eventLabel,
      })
    },
    handleSendGA(param = {}) {
      this.$ga.event(param)
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  background-color: #f5f5f5;
}
.header-top-layer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  max-width: 1024px;
  height: 90px;
  margin-left: auto;
  margin-right: auto;
  @include media-breakpoint-up(xl) {
    height: 70px;
  }
}
.menu-icon {
  flex: 0 0 auto;
  width: 24px;
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
.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 1 auto;
  // 58 = (24 + 18) + (8 * 2)
  width: calc(100% - 58px);
  @include media-breakpoint-up(xl) {
    justify-content: flex-start;
    width: auto;
  }
}
.logo {
  cursor: pointer;
  user-select: none;
  img {
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
  flex: 0 0 auto;
  align-items: center;
  z-index: 149;
}
.others-list {
  display: none;
  @include media-breakpoint-up(xl) {
    display: block;
  }
}
.header-nav {
  box-shadow: 0 2px 1px rgba(#000, 0.2);
  position: relative;
  z-index: 99;
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
