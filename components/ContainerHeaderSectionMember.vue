<template>
  <header class="header">
    <a href="/" class="header__logo logo">
      <img src="~/assets/logo@2x.png" alt="logo" />
    </a>
    <nav class="header__member-nav member-nav">
      <ul
        v-if="sectionsMember.length > 0"
        class="member-nav__member-section-list member-section-list"
      >
        <UiHeaderSectionMemberListItem
          v-for="section in sectionsMember"
          :key="section.id"
          :section="section"
        />
      </ul>
    </nav>
    <button
      class="header__sidebar-toggle-button sidebar-toggle-button"
      @click="handleSidebarToggle"
    >
      <SvgSidebarToggleButton />
    </button>
  </header>
</template>

<script>
import UiHeaderSectionMemberListItem from '~/components/UiHeaderSectionMemberListItem.vue'
import SvgSidebarToggleButton from '~/assets/premium-header-sidebar-toggle.svg?inline'

export default {
  components: {
    UiHeaderSectionMemberListItem,
    SvgSidebarToggleButton,
  },
  data() {
    return {
      shouldShowCategoryList: false,
    }
  },
  computed: {
    sectionsMember() {
      return this.$store.getters['sections/sectionsMember']
    },
  },
  methods: {
    handleSidebarToggle() {
      this.$emit('sidebarToggle')
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  z-index: 499;
  width: 100%;
  height: 64px;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0 10px;
  position: relative;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.06);
  &__logo {
    position: absolute;
    left: 10px;
  }
  &__member-nav {
    display: none;
    @include media-breakpoint-up(xl) {
      display: flex;
    }
  }
  &__sidebar-toggle-button {
    position: absolute;
    right: 10px;
  }
}

.logo {
  display: block;
  width: 44px;
  height: 44px;
  img {
    width: 100%;
    height: 100%;
  }
}

.member-nav {
  height: 100%;
  margin: 0 auto;
}

.member-section-list {
  display: flex;
}

.sidebar-toggle-button {
  width: 44px;
  height: 44px;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}
</style>
