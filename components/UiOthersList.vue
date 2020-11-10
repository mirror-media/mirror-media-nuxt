<template>
  <div v-click-outside="closeLinkList" class="others-list">
    <button type="button" class="more-icon" @click="handleClickMoreIcon" />
    <div v-if="shouldOpenLinkList" class="link-list">
      <a
        v-for="link in links"
        :key="link.title"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="emitGA(`more ${link.name}`)"
      >
        {{ link.title }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiOthersList',
  props: {
    links: {
      type: Array,
      required: true,
      default: () => [],
    },
    eventCategory: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      shouldOpenLinkList: false,
    }
  },
  methods: {
    toggleLinkList() {
      this.shouldOpenLinkList = !this.shouldOpenLinkList
    },
    closeLinkList() {
      this.shouldOpenLinkList = false
    },
    handleClickMoreIcon() {
      this.toggleLinkList()
      this.emitGA('more open')
    },
    emitGA(eventLabel) {
      this.$emit('sendGA', {
        eventCategory: this.eventCategory,
        eventAction: 'click',
        eventLabel,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.others-list {
  margin-left: 5px;
  position: relative;
}
.more-icon {
  display: block;
  background-image: url(~assets/more_grey@2x.png);
  background-position: center;
  background-repeat: no-repeat;
  width: 5px;
  height: 20px;
  background-size: 5px;
  padding-left: 8px;
  padding-right: 8px;
  box-sizing: content-box;
  cursor: pointer;
  user-select: none;
}
.link-list {
  text-align: center;
  position: absolute;
  top: 28px;
  left: 8px;
  width: 130px;
  background-color: #fff;
  border: 1px solid #eee;
  color: #34495e;
  line-height: 1.15;
  font-size: 16px;
  & a {
    display: block;
    padding: 8px 16px;
  }
}
</style>
