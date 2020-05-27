<template>
  <header>
    <button type="button" class="menu-icon" @click="openSidebar" />
    <UISidebar
      v-if="isSidebar"
      :topics="topics"
      :sections="sections"
      :partners="partners"
      :others="otherLinks"
      :socialMedia="mediaLinks"
      @close="closeSidebar"
    />

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

import { MEDIA_LINKS, OTHER_LINKS } from '~/constants/index'

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
      isSidebar: true,
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
      return Object.values(OTHER_LINKS)
    },
    mediaLinks() {
      return Object.values(MEDIA_LINKS)
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
</style>
