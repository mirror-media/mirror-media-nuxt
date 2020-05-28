<template>
  <header>
    <button type="button" class="menu-icon" @click="openSidebar" />
    <transition name="slide">
      <UISidebar
        v-if="isSidebar"
        :topics="topics"
        :sections="sections"
        :partners="partners"
        :subBrands="subBrandLinks"
        :others="otherLinks"
        :socialMedia="mediaLinks"
        @close="closeSidebar"
      />
    </transition>

    <div class="header-search">
      <UISearchBarWrapper :options="options" @sendGA="handleSendGA" />
      <UIOthersList
        class="others-list"
        :links="otherLinks"
        eventCategory="header"
        @sendGA="handleSendGA"
      />
    </div>

    <nav class="header-nav">
      <UIHeaderNavSection
        :sections="sections"
        :partners="partners"
        @sendGA="handleSendGA"
      />
      <UIHeaderNavTopic :topics="topics" @sendGA="handleSendGA" />
    </nav>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'

import UISidebar from './UISidebar.vue'
import UISearchBarWrapper from './UISearchBarWrapper.vue'
import UIOthersList from './UIOthersList.vue'
import UIHeaderNavSection from './UIHeaderNavSection.vue'
import UIHeaderNavTopic from './UIHeaderNavTopic.vue'

import { SUB_BRAND_LINKS, MEDIA_LINKS, OTHER_LINKS } from '~/constants/index'

export default {
  name: 'ContainerHeader',
  components: {
    UISidebar,
    UISearchBarWrapper,
    UIOthersList,
    UIHeaderNavSection,
    UIHeaderNavTopic,
  },
  data() {
    return {
      isSidebar: false,
      defaultOption: { title: '全部類別' },
    }
  },
  computed: {
    ...mapGetters({
      sections: 'sections/displayedSections',
      partners: 'partners/displayedPartners',
      topics: 'topics/displayedTopics',
    }),
    options() {
      const sections = this.sections.filter(
        (section) => section.name !== 'videohub'
      )
      return [this.defaultOption, ...sections]
    },
    otherLinks() {
      return this.transformObjIntoArray(OTHER_LINKS)
    },
    mediaLinks() {
      return this.transformObjIntoArray(MEDIA_LINKS)
    },
    subBrandLinks() {
      return this.transformObjIntoArray(SUB_BRAND_LINKS)
    },
  },
  methods: {
    openSidebar() {
      this.isSidebar = true
    },
    closeSidebar() {
      this.isSidebar = false
    },
    handleSendGA(param = {}) {
      this.$ga.event(param)
    },
    transformObjIntoArray(obj) {
      return Object.values(obj)
    },
  },
}
</script>

<style lang="scss" scoped>
header {
  background-color: #f5f5f5;
}
.menu-icon {
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
.header-search {
  display: flex;
  align-items: center;
  z-index: 149;
  position: relative;
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
