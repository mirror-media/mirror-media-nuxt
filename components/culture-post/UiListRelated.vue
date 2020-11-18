<template>
  <div class="list-related">
    <h2>延伸閱讀</h2>

    <div class="list">
      <div v-for="item in items" :key="item.slug" class="item">
        <a
          :href="`/story/${item.slug}`"
          class="item__img"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :src="gainImgSrcById(imgs, item.heroImage)" alt="" />
        </a>

        <a
          :href="`/story/${item.slug}`"
          class="item__title"
          target="_blank"
          rel="noopener noreferrer"
          >{{ item.title }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { gainImgSrcById } from '~/utils/img.js'

export default {
  name: 'UiListRelated',

  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
    imgs: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  methods: {
    gainImgSrcById,
  },
}
</script>

<style lang="scss" scoped>
.list-related {
  width: 300px;
  padding-bottom: 63px;
  margin-left: auto;
  margin-right: auto;
  @include media-breakpoint-up(md) {
    width: 700px;
  }
}

h2 {
  width: 266px;
  margin-left: auto;
  margin-right: auto;
  font-family: source-han-serif-tc, 'Songti TC', serif;
  font-size: 28px;
  font-weight: 900;
  @include media-breakpoint-up(md) {
    width: 634px;
  }
}

.list {
  margin-top: 40px;
  @include media-breakpoint-up(md) {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
  }
}

a {
  display: block;
}

.item {
  display: flex;
  @include media-breakpoint-up(md) {
    display: block;
    width: calc((100% - 60px) / 3);
    margin-top: 20px;
    margin-left: 10px;
    margin-right: 10px;
  }

  + .item {
    margin-top: 20px;
  }

  &__img {
    position: relative;
    width: 116px;
    padding-top: calc(116px * 0.6666);
    @include media-breakpoint-up(md) {
      width: 100%;
      padding-top: 66.66%;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__title {
    flex-grow: 1;
    flex-basis: 0%;
    margin-left: 10px;
    font-family: source-han-serif-tc, 'Songti TC', serif;
    font-size: 15px;
    font-weight: 900;
    line-height: 1.73;
    @include media-breakpoint-up(md) {
      margin-top: 10px;
    }
  }
}
</style>
