<template>
  <section class="header-nav-section">
    <div class="container">
      <div class="section section--home">
        <a href="/" @click="emitGa('section home')">
          <h2>首頁</h2>
        </a>
      </div>

      <div
        v-for="section in sections"
        :key="section.order"
        class="section"
        :class="[
          `section--${getSectionSlug(section)}`,
          { active: isCurrentSection(section) },
        ]"
      >
        <a :href="section.href" @click="emitGa(`section ${section.slug}`)">
          <h2>{{ section.name }}</h2>
        </a>
        <div v-if="section.type === 'section'" class="section__dropdown">
          <a
            v-for="category in section.categories"
            :key="category.id"
            :href="category.href"
            @click="emitGa(`category ${category.slug}`)"
          >
            <h3>{{ category.name }}</h3>
          </a>
        </div>
      </div>

      <!-- <div class="section section&#45;&#45;external">
        <h2>合作媒體</h2>
        <div class="section__dropdown">
          <a
            v-for="partner in partners"
            :key="partner.id"
            :href="`/externals/${partner.name}`"
            @click="emitGa(`external ${partner.name}`)"
          >
            <h3>{{ partner.display }}</h3>
          </a>
        </div>
      </div> -->
    </div>
  </section>
</template>

<script>
export default {
  name: 'UiHeaderNavSection',
  props: {
    sections: {
      type: Array,
      required: true,
      default: () => [],
    },
    currentSectionName: {
      type: String,
      default: undefined,
    },
    currentCategoryName: {
      type: String,
      default: undefined,
    },
    partners: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  methods: {
    isCurrentSection(section) {
      const sectionType = section.type
      switch (sectionType) {
        case 'section': {
          return section.slug === this.currentSectionName
        }
        case 'category': {
          const { path } = this.$route
          const cat = '/category/'
          const removePrefix = (str = '', prefix = '') => {
            return str.slice(prefix.length)
          }
          const categoryName = removePrefix(path, cat)
          const { sections } = section
          if (path.startsWith(cat)) {
            return (
              sections?.[0] === this.currentSectionName &&
              categoryName === section.slug
            )
          } else {
            return this.currentCategoryName === section.slug
          }
        }

        default:
          return false
      }
    },
    getSectionSlug(section) {
      switch (section.type) {
        case 'section':
          return section.slug
        case 'category':
          return section?.sections?.[0]
        default:
          return null
      }
    },
    getCategoryHref(sectionName, categoryName) {
      if (sectionName === 'videohub') {
        return `/video_category/${categoryName}`
      }
      if (categoryName === 'magazine') {
        return '/magazine/'
      }
      return `/category/${categoryName}`
    },
    emitGa(eventLabel) {
      this.$emit('sendGa', {
        eventCategory: 'header',
        eventAction: 'click',
        eventLabel,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.header-nav-section {
  font-size: 14px;
  // to hide scrollbar
  height: 36px;
  overflow: hidden;

  display: flex;
  justify-content: center;
  @include media-breakpoint-up(xl) {
    background-color: #064f77;
    font-size: 16px;
    height: auto;
    overflow: visible;
  }
  a {
    display: block;
  }
  .container {
    // to hide scrollbar
    height: 48px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-x: auto;
    max-width: 1024px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    @include media-breakpoint-up(xl) {
      width: 100%;
      height: 45px;
      justify-content: center;
      overflow: visible;
    }
  }
  .section {
    flex: 0 0 auto;
    position: relative;
    color: #808080;
    cursor: pointer;
    user-select: none;
    line-height: 1.15;
    > a {
      padding: 7px 11px 5px 11px;
      @include media-breakpoint-up(xl) {
        padding: 0;
      }
    }
    @include media-breakpoint-up(xl) {
      color: #fff;
      line-height: 42px;
      min-width: calc(100% / 11);
      border-top-width: 3px;
      border-top-style: solid;
      @each $name, $color in $sections-color {
        &--#{$name} {
          border-top-color: $color;
          &:hover {
            background-color: $color;
          }
          & .section__dropdown a:hover {
            background-color: $color;
          }
        }
      }
      &:hover .section__dropdown {
        display: block;
      }
      &--home {
        display: none;
      }
    }
    &:hover {
      color: #34495e;
      @include media-breakpoint-up(xl) {
        color: #fff;
      }
    }
    &.active {
      color: #34495e;
      @include media-breakpoint-up(xl) {
        color: #fff;
      }
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        height: 3px;
        width: calc(100% - 22px);
        background-color: #34495e;
        @include media-breakpoint-up(xl) {
          content: none;
        }
      }
    }
    &--member {
      color: #e51731;
      &:hover {
        color: #db1730;
      }
      &.active {
        color: #e51731;
        &::after {
          background-color: #e51731;
        }
      }
      @include media-breakpoint-up(xl) {
        color: #fff;
        background-color: #e51731;
        &:hover {
          color: #fff;
        }
        &.active {
          color: #fff;
        }
      }
    }
    /* &--external {
      display: none;
      @include media-breakpoint-up(xl) {
        display: block;
      }
    } */
    &__dropdown {
      position: absolute;
      display: none;
      width: 110px;
      left: 0;
      top: 100%;
      background-color: #333;
      text-align: center;
      a {
        line-height: 1.3;
        padding: 13px 10px;
      }
    }
  }
}
</style>
