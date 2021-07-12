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
    <div class="header__member-sidebar-toggle member-sidebar-toggle">
      <ClientOnly>
        <ContainerMembershipMemberIcon class="member-icon" />
      </ClientOnly>
      <button
        class="member-sidebar-toggle__sidebar-toggle-button sidebar-toggle-button"
        @click="handleSidebarToggle"
      >
        <SvgSidebarToggleButton />
      </button>
    </div>
  </header>
</template>

<script>
import UiHeaderSectionMemberListItem from '~/components/UiHeaderSectionMemberListItem.vue'
import SvgSidebarToggleButton from '~/assets/premium-header-sidebar-toggle.svg?inline'
import ContainerMembershipMemberIcon from '~/components/ContainerMembershipMemberIcon.vue'

export default {
  components: {
    UiHeaderSectionMemberListItem,
    SvgSidebarToggleButton,
    ContainerMembershipMemberIcon,
  },
  data() {
    return {
      shouldShowCategoryList: false,
    }
  },
  computed: {
    sectionsMember() {
      return this.$store.state['sections-member'].data.concat([
        {
          id: 'mirrormagazine',
          name: 'magazine',
          customPath: null,
          title: '電子雜誌',
          categories: [],
          shouldShowSeparator: true,
        },
      ])
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
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  position: relative;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.06);
  @include media-breakpoint-up(xl) {
    padding: 0 60px;
  }

  &__member-nav {
    display: none;
    @include media-breakpoint-up(xl) {
      display: flex;
    }
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

.member-sidebar-toggle {
  display: flex;
  align-items: center;
  &__sidebar-toggle-button {
    margin: 0 0 0 23px;
  }
}

.member-icon {
  width: 30px;
  height: 33px;
}

.sidebar-toggle-button {
  width: 44px;
  height: 44px;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}
</style>
