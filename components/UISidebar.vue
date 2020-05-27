<template>
  <section class="sidebar">
    <button class="close-icon" @click="$emit('close')" />

    <div class="topics">
      <nuxt-link
        v-for="topic in topics"
        :key="topic.id"
        :to="`/topic/${topic.id}`"
        class="topics__title"
      >
        <h2>{{ topic.name }}</h2>
      </nuxt-link>

      <nuxt-link to="/section/topic" class="topics__title">
        <h2>更多</h2>
      </nuxt-link>
    </div>

    <div class="sections">
      <div
        v-for="section in sections"
        :key="section.id"
        :class="`section section--${section.name}`"
      >
        <nuxt-link :to="`/section/${section.name}`" class="section__title">
          <h2>{{ section.title }}</h2>
        </nuxt-link>
        <div class="section__categories">
          <nuxt-link
            v-for="category in section.categories"
            :key="category.id"
            :to="`/category/${category.name}`"
          >
            <h3>{{ category.title }}</h3>
          </nuxt-link>
        </div>
      </div>

      <div class="section section--external">
        <div class="section__title">
          <h2>健康醫療</h2>
        </div>
        <div class="section__categories">
          <nuxt-link
            v-for="partner in partners"
            :key="partner.id"
            :to="`/externals/${partner.name}`"
          >
            <h3>{{ partner.display }}</h3>
          </nuxt-link>
        </div>
      </div>

      <div
        v-for="subBrand in subBrands"
        :key="subBrand.name"
        class="section"
        :class="`section--${subBrand.name}`"
      >
        <a :href="subBrand.href" target="_blank" class="section__title">
          {{ subBrand.title }}
        </a>
      </div>
    </div>

    <div class="others">
      <a
        v-for="other in others"
        :key="other.name"
        :href="other.href"
        target="_blank"
      >
        {{ other.title }}
      </a>
    </div>

    <div class="social-media">
      <a
        v-for="media in socialMedia"
        :key="media.name"
        :href="media.href"
        target="_blank"
      >
        <img
          :class="media.name"
          src="~/assets/transperent.png"
          :alt="media.name"
        />
      </a>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UISidebar',
  props: {
    topics: {
      type: Array,
      required: true,
    },
    sections: {
      type: Array,
      required: true,
    },
    partners: {
      type: Array,
      required: true,
    },
    subBrands: {
      type: Array,
      required: true,
    },
    others: {
      type: Array,
      required: true,
    },
    socialMedia: {
      type: Array,
      required: true,
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
  z-index: 999;
  overflow-y: auto;
  color: #fff;
  padding: 44px 16px 16px 16px;
  line-height: 1.15;
  @include media-breakpoint-up(xl) {
    display: none;
  }
}
a {
  display: block;
}
.close-icon {
  position: absolute;
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
.others {
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
