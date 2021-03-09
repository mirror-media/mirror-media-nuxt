<template>
  <header class="header">
    <a href="/" class="header__logo logo">
      <img src="~/assets/logo@2x.png" alt="logo" />
    </a>
    <nav class="header__member-nav member-nav">
      <ul class="member-nav__member-section-list member-section-list">
        <li
          v-if="memberSectionExist"
          class="member-section-list__section"
          @mouseover="shouldShowCategoryList = true"
          @mouseout="shouldShowCategoryList = false"
        >
          <div class="section">
            <h1 class="section__title">
              <a
                :href="`/section/${memberSection.name}`"
                v-text="memberSection.title"
              />
            </h1>
            <ul
              v-show="shouldShowCategoryList"
              class="section__member-category-list member-category-list"
            >
              <li
                v-for="category in memberSectionCategories"
                :key="category.id"
                class="member-category-list__category"
              >
                <a
                  :href="`/category/${category.name}`"
                  v-text="category.title"
                />
              </li>
            </ul>
          </div>
        </li>
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
import SvgSidebarToggleButton from '~/assets/premium-header-sidebar-toggle.svg?inline'

export default {
  components: {
    SvgSidebarToggleButton,
  },
  data() {
    return {
      shouldShowCategoryList: false,
    }
  },
  computed: {
    memberSection() {
      return (
        (this.$store.state?.sections?.data?.items ?? []).find(
          function findSectionMemberByName(section) {
            return section?.name === 'member'
          }
        ) ?? {}
      )
    },
    memberSectionExist() {
      return Object.entries(this.memberSection).length > 0
    },
    memberSectionCategories() {
      return this.memberSection?.categories ?? []
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
  width: 634px;
  height: 100%;
  margin: 0 auto;
}

.member-section-list {
  &__section {
    cursor: pointer;
    width: 113px;
    height: 100%;
    color: #4a4a4a;
  }
}

.section {
  height: 100%;
  &__title {
    height: 100%;
    &:hover {
      background-color: #054f77;
      color: white;
    }
    a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.member-category-list {
  width: 145px;
  max-height: calc(100vh - 64px);
  background-color: white;
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2));
  overflow-y: scroll;
  &__category {
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: #054f77;
      color: white;
    }
    a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.sidebar-toggle-button {
  width: 44px;
  height: 44px;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}
</style>
