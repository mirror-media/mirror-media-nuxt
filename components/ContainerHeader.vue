<template>
  <header>
    <div class="header-top-layer">
      <button
        type="button"
        class="menu-icon"
        aria-label="menu-icon"
        @click="handleClickMenuIcon"
      />

      <div class="logo-wrapper">
        <a href="/" class="logo" @click="sendHeaderGa('logo')">
          <img src="~/assets/logo.png" :alt="SITE_TITLE" />
        </a>

        <UiEventLogo
          v-if="shouldOpenEventLogo"
          class="logo"
          :eventLogo="eventLogo"
          @sendGa="handleSendGa"
        />
        <client-only>
          <ContainerGptAd
            v-show="hasGptLogo"
            pageKey="global"
            adKey="RWD_LOGO"
            class="logo"
            @slotRenderEnded="handleLogoAdRenderEnded"
          />
        </client-only>
      </div>

      <div class="header-search">
        <UiSearchBarWrapper :options="options" @sendGa="handleSendGa" />
        <UiOthersList
          class="others-list"
          :links="otherLinks"
          eventCategory="header"
          @sendGa="handleSendGa"
        />
      </div>
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
        :subBrands="subBrandLinks"
        @sendGa="handleSendGa"
      />
    </nav>

    <transition name="slide">
      <UiSidebar
        v-if="shouldOpenSidebar"
        :topics="topics"
        :sections="sections"
        :partners="partners"
        :subBrands="subBrandLinks"
        :others="otherLinks"
        :socialMedia="socialMediaLinks"
        @close="handleSidebarClose"
        @sendGa="handleSendGa"
      />
    </transition>
  </header>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

import UiEventLogo from './UiEventLogo.vue'
import UiSearchBarWrapper from './UiSearchBarWrapper.vue'
import UiOthersList from './UiOthersList.vue'
import UiHeaderNavSection from './UiHeaderNavSection.vue'
import UiHeaderNavTopic from './UiHeaderNavTopic.vue'
import UiSidebar from './UiSidebar.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'

import {
  SUB_BRAND_LINKS,
  SOCIAL_MEDIA_LINKS,
  OTHER_LINKS,
  SITE_TITLE,
} from '~/constants/index'

export default {
  name: 'ContainerHeader',
  components: {
    UiEventLogo,
    UiSearchBarWrapper,
    UiOthersList,
    UiHeaderNavSection,
    UiHeaderNavTopic,
    UiSidebar,
    ContainerGptAd,
  },
  data() {
    return {
      eventLogo: {},
      now: new Date(),
      intervalIdOfUpdateNow: undefined,
      shouldOpenSidebar: false,
      defaultOption: { title: '全部類別' },
      SITE_TITLE,
      hasGptLogo: false,
    }
  },
  computed: {
    ...mapState(['sectionName']),
    ...mapGetters({
      sections: 'sections/displayedSections',
      sectionByCategoryName: 'sections/sectionByCategoryName',
      partners: 'partners/displayedPartners',
      topics: 'topics/displayedTopics',
    }),
    shouldOpenEventLogo() {
      // 當有 GPT Logo 時不應該出現 Event Logo
      if (!this.hasEventLogo || this.hasGptLogo) {
        return false
      }

      const startTime = new Date(this.eventLogo.startDate)
      const endTime = new Date(this.eventLogo.endDate)

      return this.duringThePeriodBetween(startTime, endTime)
    },
    hasEventLogo() {
      return Object.keys(this.eventLogo).length > 0
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
    '$route.path': {
      handler: 'activeTheNavSection',
      immediate: true,
    },
  },
  beforeMount() {
    this.fetchOnClient()

    this.intervalIdOfUpdateNow = setInterval(this.updateNow, 1000)
  },
  beforeDestroy() {
    clearInterval(this.intervalIdOfUpdateNow)
  },
  methods: {
    ...mapMutations(['setSectionName']),
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
    duringThePeriodBetween(startTime, endTime) {
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
    activeTheNavSection(path) {
      const regexWithPrefixOfStory = this.generateRegexWithPrefixOf('/story/')

      // 文章頁也需要設定 sectionName，但不是在這邊做，而需移到 story page，故 return
      if (this.hasPrefix(path, regexWithPrefixOfStory)) {
        return
      }

      const regexWithPrefixOfSection = this.generateRegexWithPrefixOf(
        '/section/'
      )
      const regexWithPrefixOfCategory = this.generateRegexWithPrefixOf(
        '/category/'
      )
      let sectionName

      if (path === '/') {
        sectionName = 'home'
      } else if (this.hasPrefix(path, regexWithPrefixOfSection)) {
        sectionName = this.removePrefix(path, regexWithPrefixOfSection)
        if (sectionName === 'topic') {
          return
        }
      } else if (this.hasPrefix(path, regexWithPrefixOfCategory)) {
        const categoryName = this.removePrefix(path, regexWithPrefixOfCategory)
        sectionName = this.sectionByCategoryName(categoryName).name
      }

      this.setSectionName(sectionName)
    },
    generateRegexWithPrefixOf(string) {
      return new RegExp(`^${string}`, 'i')
    },
    hasPrefix(string, prefix) {
      return prefix.test(string)
    },
    removePrefix(string, prefix) {
      return string.split(prefix)[1]
    },
  },
}
</script>

<style lang="scss" scoped>
$menu-icon-width: 24px;
$logo-wrapper-margin-x: 8px;
$search-icon-width: 18px;

header {
  background-color: #f5f5f5;
  z-index: 99;
  position: relative;
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
