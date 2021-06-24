<template>
  <section class="index" :class="{ active: isIndexActive }">
    <button class="index__btn open" @click="$emit('openIndex')">
      <!-- TODO: inline svg -->
      <img
        v-if="isCurrentPagePremium"
        src="~/assets/premium-header-sidebar-toggle.svg"
        alt="開啟"
      />
      <img v-else src="~/assets/hamburger.svg" alt="開啟" />
    </button>

    <div class="index__curtain" @click.self="$emit('closeIndex')">
      <div ref="indexContainer" class="index-container">
        <button class="index__btn close" @click="$emit('closeIndex')">
          <SvgClose />
        </button>

        <div :class="['top', { 'top--hidden': bottomStyle === 'white' }]">
          <div v-if="items.length > 0" class="index-list">
            <ul>
              <li
                v-for="(item, index) in items"
                :key="item.id"
                :class="{ active: currentIndex === index + 1 }"
              >
                <!-- eslint-disable vue/no-v-html -->
                <a
                  :href="`#header-${item.id}`"
                  @click="handleIndexClick(item.id)"
                  v-html="item.content"
                />
                <!-- eslint-enable vue/no-v-html -->
              </li>
            </ul>
          </div>
        </div>
        <div
          v-if="isCurrentPagePremium"
          :class="['bottom', { 'bottom--white': bottomStyle === 'white' }]"
        >
          <ul
            v-if="sectionsMember.length > 0"
            class="bottom__member-section-list member-section-list"
          >
            <li
              v-for="section in sectionsMember"
              :key="section.id"
              :class="[
                'member-section-list__section',
                {
                  'member-section-list__section--separator-top':
                    section.shouldShowSeparator,
                },
              ]"
            >
              <div class="section">
                <h1
                  :class="[
                    'section__title',
                    {
                      'section__title--small':
                        section.customPath === 'category',
                    },
                  ]"
                >
                  <a
                    :href="`${
                      section.customPath !== null
                        ? '/' + (section.customPath || 'premiumsection')
                        : ''
                    }/${section.name}`"
                    v-text="section.title"
                  />
                </h1>
                <ul class="section__member-category-list member-category-list">
                  <li
                    v-for="category in section.categories"
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
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import SvgClose from '~/assets/premium-header-sidebar-hide.svg?inline'

export default {
  name: 'UiArticleIndex',

  components: {
    SvgClose,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },
    currentIndex: {
      type: Number,
      default: 0,
      required: true,
    },
    isIndexActive: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    bottomStyle: {
      type: String,
      default: 'blue',
      validator(value) {
        return ['blue', 'white'].includes(value)
      },
    },
  },

  computed: {
    sectionsMember() {
      return this.$store.getters['sections/sectionsMember']
    },

    isCurrentPagePremium() {
      return this.isPremium || this.$route.name === 'premium-slug'
    },
  },

  watch: {
    isIndexActive(isActive) {
      isActive
        ? disableBodyScroll(this.$refs.indexContainer)
        : enableBodyScroll(this.$refs.indexContainer)
    },
  },

  methods: {
    handleIndexClick(id) {
      this.$emit('closeIndex')
      this.$scrollTo(`#header-${id}`, 500, {
        lazy: false,
        offset: -64,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.index {
  @include media-breakpoint-up(xl) {
    position: sticky;
  }

  &.active .index__curtain {
    display: block;
  }

  &__btn {
    display: flex;
    justify-content: center;
    align-items: center;
    top: 10px;
    right: 10px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    cursor: pointer;
    user-select: none;
    outline: none;
    @include media-breakpoint-up(xl) {
      display: none;
    }

    &.open {
      position: fixed;
      z-index: 500;
    }

    &.close {
      position: absolute;
    }
  }

  &__curtain {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 510;
    width: 100%;
    height: 100%;
    background-color: rgba(#000, 0.8);
    @include media-breakpoint-up(xl) {
      display: inline-block;
      top: 50%;
      left: calc((100% - 634px) / 4);
      right: auto;
      bottom: auto;
      transform: translate(-50%, -50%);
      background-color: transparent;
      width: auto;
      height: auto;
    }
  }

  &-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    right: 0;
    width: 81.25%;
    height: 100%;
    background-color: #fff;
    overflow-y: scroll;
    @include media-breakpoint-up(md) {
      width: 78.125%;
    }
    @include media-breakpoint-up(xl) {
      overflow-y: hidden;
      width: 244px;
      position: static;
      padding: 0;
      background-color: transparent;
    }
  }
}

.top {
  padding: 98px 24px 24px 24px;
  @include media-breakpoint-up(xl) {
    padding: 0;
  }
}

.index-list {
  display: inline-block;

  + * {
    margin-top: 48px;
  }

  ul {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin: 0;
    padding: 0;
    @include media-breakpoint-up(xl) {
      width: 240px;
    }

    li {
      display: inline;
      font-family: source-han-serif-tc, 'Songti TC', serif;
      font-size: 18px;
      line-height: 27px;
      font-weight: 700;
      cursor: pointer;

      &.active a {
        border-bottom: solid 2px #dec5a2;
      }

      + li {
        margin-top: 19px;
      }
    }
  }
}

.top {
  margin: auto 0;
  &--hidden {
    display: none;
  }
}

.bottom {
  flex: 1 1 auto;
  background-color: #054f77;
  padding: 24px;
  color: white;
  @include media-breakpoint-up(xl) {
    display: none;
  }

  &--white {
    background-color: white;
    color: #4a4a4a;
    padding: 78px 24px;
    @include media-breakpoint-up(md) {
      padding: 78px 48px;
    }

    .section__title {
      color: #054f77;
    }

    .section__title--small {
      color: #4a4a4a;
    }

    .member-category-list__category,
    .section__title--small {
      font-weight: 300;
    }

    .member-section-list__section--separator-top {
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}

.member-section-list {
  display: flex;
  flex-direction: column;
  &__section {
    &--separator-top {
      border-top: 1px solid rgba(255, 255, 255, 0.3);
      padding: 24px 0 0 0;
    }
    & + & {
      margin: 26px 0 0 0;
    }
  }
}

.section {
  &__title {
    font-size: 20px;
    &--small {
      font-size: 18px;
    }
  }
}

.member-category-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0 0 0 -16px;
  &__category {
    margin: 16px 0 0 16px;
    font-size: 18px;
  }
}
</style>
