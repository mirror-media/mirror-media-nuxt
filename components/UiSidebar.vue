<template>
  <section class="sidebar">
    <button class="close-icon" @click="$emit('close')" />

    <div v-if="shouldOpenTopics" class="topics">
      <a
        v-for="topic in topics"
        :key="topic.id"
        :href="`/topic/${topic.id}`"
        class="topics__title"
        @click="emitGa(`topic ${topic.name}`)"
      >
        <h2>{{ topic.name }}</h2>
      </a>

      <a
        href="/section/topic"
        class="topics__title"
        @click="emitGa('topic 更多')"
      >
        <h2>更多</h2>
      </a>
    </div>

    <div class="sections">
      <div
        v-for="section in sections"
        :key="section.id"
        :class="`section section--${getSectionSlug(section)}`"
      >
        <a
          :href="section.href"
          class="section__title"
          @click="emitGa(`section ${section.slug}`)"
        >
          <h2>{{ section.name }}</h2>
        </a>

        <div
          v-if="
            section.type === 'section' &&
            shouldOpenCategories(section.categories)
          "
          class="section__categories"
        >
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

      <!--      <div v-if="shouldOpenSectionExternal" class="section section&#45;&#45;external">-->
      <!--        <div class="section__title">-->
      <!--          <h2>合作媒體</h2>-->
      <!--        </div>-->

      <!--        <div class="section__categories">-->
      <!--          <a-->
      <!--            v-for="partner in partners"-->
      <!--            :key="partner.id"-->
      <!--            :href="`/externals/${partner.name}`"-->
      <!--            @click="emitGa(`external ${partner.name}`)"-->
      <!--          >-->
      <!--            <h3>{{ partner.display }}</h3>-->
      <!--          </a>-->
      <!--        </div>-->
      <!--      </div>-->

      <div
        v-for="subBrand in subBrands"
        :key="subBrand.name"
        class="section"
        :class="`section--${subBrand.name}`"
      >
        <a
          :href="subBrand.href"
          target="_blank"
          class="section__title"
          rel="noopener noreferrer"
          @click="emitGa(`section ${subBrand.name}`)"
        >
          {{ subBrand.title }}
        </a>
      </div>
    </div>

    <div class="promotions">
      <a
        v-for="promotion in promotions"
        :key="promotion.name"
        :href="promotion.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="emitGa(`more ${promotion.name}`)"
      >
        {{ promotion.title }}
      </a>
    </div>

    <div class="social-media">
      <a
        v-for="medium in socialMedia"
        :key="medium.name"
        :href="medium.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="emitGa(`social ${medium.name}`)"
      >
        <img
          :class="medium.name"
          src="~/assets/transperent.png"
          :alt="medium.name"
        />
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UiSidebar',
  props: {
    topics: {
      type: Array,
      required: true,
      default: () => [],
    },
    sections: {
      type: Array,
      required: true,
      default: () => [],
    },
    partners: {
      type: Array,
      required: true,
      default: () => [],
    },
    subBrands: {
      type: Array,
      required: true,
      default: () => [],
    },
    promotions: {
      type: Array,
      required: true,
      default: () => [],
    },
    socialMedia: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  computed: {
    shouldOpenTopics() {
      return this.topics.length > 0
    },
    shouldOpenSectionExternal() {
      return this.partners.length > 0
    },
  },
  methods: {
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
    shouldOpenCategories(categories = []) {
      return categories.length > 0
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
        eventCategory: 'sidebar',
        eventAction: 'click',
        eventLabel,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  background-color: #333;
  width: 100%;
  height: 100vh;
  z-index: 539;
  overflow-y: auto;
  color: #fff;
  padding: calc(36px + 2.5%) 5% 5% 5%;
  line-height: 1.15;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}
a {
  display: inline-block;
  cursor: pointer;
  user-select: none;
}
.close-icon {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 20px;
  height: 20px;
  background-image: url(~assets/close_white@2x.png);
  background-size: 20px;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  user-select: none;
}
.topics {
  display: flex;
  flex-wrap: wrap;
  font-size: 16px;
  margin-right: -8px;
  margin-left: -8px;
  margin-bottom: 16px;
  &__title {
    border-right: 1px solid #fff;
    padding-left: 8px;
    padding-right: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
    &:last-child {
      border-right: none;
    }
  }
}
.sections {
  margin-bottom: 16px;
  .section {
    border-left-width: 3px;
    border-left-style: solid;
    border-bottom: 1px solid #7e7e7e;
    padding-top: 16px;
    padding-bottom: 16px;
    padding-left: 16px;
    font-weight: 300;
    @each $name, $color in $sections-color {
      &--#{$name} {
        border-left-color: $color;
      }
    }
    &--mirrorvoice {
      border-left-color: #ff521d;
    }
    &--mirrorfiction {
      border-left-color: #968375;
    }
    &--readr {
      border-left-color: #000;
      border-bottom: none;
    }
    &__title {
      font-size: 19.2px;
    }
    &__categories {
      display: flex;
      font-size: 17.6px;
      color: #969696;
      flex-wrap: wrap;
      margin-top: 16px;
      margin-bottom: -4px;
      a {
        margin-top: 4px;
        margin-bottom: 4px;
        margin-right: 18px;
      }
    }
  }
}
.promotions {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  font-weight: 300;
  color: #969696;
  justify-content: space-between;
  margin-bottom: 16px;
  a {
    width: calc(50% - 4px);
    border: 1px solid #969696;
    margin-top: 8px;
    margin-bottom: 8px;
    padding-top: 4px;
    padding-bottom: 4px;
  }
}
.social-media {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  img {
    width: 20px;
    height: 20px;
    background-image: url(~assets/social-media-white@2x.png);
    display: block;
    background-size: 126px 120px;
    &.line {
      background-position: -86px -80px;
    }
    &.weibo {
      background-position: -66px -60px;
    }
    &.facebook {
      background-position: -106px -100px;
    }
    &.instagram {
      background-position: -46px -40px;
    }
    &.rss {
      background-position: -26px -20px;
    }
    &.email {
      width: 26px;
      background-position: 0 0;
    }
  }
}
</style>
