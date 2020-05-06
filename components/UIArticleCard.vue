<template>
  <div class="article" @click="handleClick">
    <div class="article__top-wrapper top-wrapper">
      <div v-lazy-container="{ selector: 'img' }" class="top-wrapper__img img">
        <img :data-src="imgSrc" />
      </div>
      <span
        class="top-wrapper__text"
        :style="{
          backgroundColor: imgTextBackgroundColor,
        }"
        v-text="imgText"
      />
    </div>
    <div
      class="article__bottom-wrapper bottom-wrapper"
      :style="{
        backgroundColor: infoBackgroundColor,
      }"
    >
      <h1 v-text="infoTitle" />
      <p v-text="infoDescription" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: '/',
    },
    imgSrc: {
      type: String,
      default: require('~/assets/notImage.png'),
    },
    imgText: {
      type: String,
      default: '',
    },
    imgTextBackgroundColor: {
      type: String,
      default: 'white',
    },
    infoTitle: {
      type: String,
      default: '',
    },
    infoDescription: {
      type: String,
      default: '',
    },
    infoBackgroundColor: {
      type: String,
      default: 'white',
    },
  },
  data() {
    return {
      ga: {
        eventCategory: 'listing',
        eventAction: 'click',
        eventLabel: 'latest',
      },
    }
  },
  computed: {
    isHrefHttp() {
      return this.isHTTP(this.href)
    },
  },
  methods: {
    isHTTP(string) {
      return RegExp('^https?://').test(string)
    },
    handleLink() {
      if (this.isHrefHttp) {
        window.open(this.href, '_blank', 'noopener', 'noreferrer')
      } else {
        this.$router.push(this.href)
      }
    },
    handleClick() {
      this.handleLink()
      this.$ga.event(this.ga)
    },
  },
}
</script>

<style lang="sass" scoped>
.article
  box-shadow: 5px 5px 5px #bcbcbc
  cursor: pointer
  @include media-breakpoint-up(xl)
    transition: all .3s ease-in-out
    &:hover
      transform: translateY(-20px)
      box-shadow: 5px 15px 5px #bcbcbc

.top-wrapper
  position: relative
  &__text
    position: absolute
    left: 0
    bottom: 0
    padding: 8px
    line-height: 1
    font-size: 16px
    color: white
    display: inline-block
    max-width: 100%
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis

.img
  padding-top: 66.66%
  positon: relative
  img
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    height: 100%
    object-fit: cover

.bottom-wrapper
  padding: 15px 30px
  text-align: justify
  h1
    font-size: 20.8px
    font-weight: 300
    color: #34495e
    line-height: 1.3
  p
    font-size: 16px
    font-weight: 300
    color: #999
    line-height: 1.5
    margin: 10px 0 0 0
    word-wrap: break-word
    -webkit-line-clamp: 3
    display: -webkit-box
    -webkit-box-orient: vertical
    overflow: hidden
</style>
