<template>
  <div @click="handleClick">
    <div v-lazy-container="{ selector: 'img' }">
      <img :data-src="imgSrc" />
    </div>
    <span
      :style="{
        backgroundColor: imgTextBackgroundColor,
      }"
      v-text="imgText"
    />
    <h1 v-text="infoTitle" />
    <p v-text="infoDescription" />
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
      default: '/',
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

<style lang="sass" scoped></style>
