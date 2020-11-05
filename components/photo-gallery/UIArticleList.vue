<template>
  <div class="article-list">
    <ul>
      <li v-for="item in items" :key="item.id">
        <a
          :href="`/story/${item.slug}/`"
          target="_blank"
          rel="noopener noreferrer"
        >
          <article>
            <picture>
              <img :src="imgSrc(item.heroImage)" alt="" />
            </picture>

            <h1>
              <span>{{ item.title }}</span>
            </h1>
          </article>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UIArticleList',

  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
    itemImgs: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  methods: {
    imgSrc(id) {
      const item =
        this.itemImgs.find(function isTheSameId(item) {
          return item.id === id
        }) ?? {}

      return item.image?.resizedTargets?.mobile?.url ?? ''
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}

li {
  max-width: 320px;
  margin: 30px auto;
  box-shadow: 3px 4px 15px rgba(#000, 0.72);
  @include media-breakpoint-up(md) {
    width: 32%;
    margin-right: 2%;
    margin-left: 0;
    margin-top: 0;

    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}

a {
  display: block;
}

picture {
  display: block;
  position: relative;
  padding-top: 75%;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

h1 {
  background-color: #fff;
  border-left: 7px solid rgba(140, 140, 140, 0.18);
  padding: 10px 20px;
  color: #34495e;
  display: flex;
  align-items: center;
  min-height: 60px;
  font-size: 16px;
  line-height: 1.125;
  @include media-breakpoint-up(md) {
    font-size: 13px;
    line-height: 1.38;
  }

  span {
    display: block;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    // 1em * 1.125 * 2
    max-height: 2.25em;
    @include media-breakpoint-up(md) {
      // 1em * 1.38 * 2
      max-height: 2.76em;
    }
  }
}
</style>
