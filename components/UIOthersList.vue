<template>
  <div v-click-outside="closeLinkList" class="others-list">
    <button type="button" class="more-icon" @click="handleClickMoreIcon" />
    <div v-if="isLinkList" class="link-list">
      <a
        :href="links.subscribe.href"
        target="_blank"
        @click="emitGA(links.subscribe.eventLabel)"
      >
        {{ links.subscribe.textContent }}
      </a>
      <a
        :href="links.magazine.href"
        target="_blank"
        @click="emitGA(links.magazine.eventLabel)"
      >
        {{ links.magazine.textContent }}
      </a>
      <a
        :href="links.auth.href"
        target="_blank"
        @click="emitGA(links.auth.eventLabel)"
      >
        {{ links.auth.textContent }}
      </a>
      <a
        :href="links.ad.href"
        target="_blank"
        @click="emitGA(links.ad.eventLabel)"
      >
        {{ links.ad.textContent }}
      </a>
      <a
        :href="links.campaign.href"
        target="_blank"
        @click="emitGA(links.campaign.eventLabel)"
      >
        {{ links.campaign.textContent }}
      </a>
      <a
        :href="links.downloadApp.href"
        target="_blank"
        @click="emitGA(links.downloadApp.eventLabel)"
      >
        {{ links.downloadApp.textContent }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UIOthersList',
  props: {
    links: {
      type: Object,
      required: true,
      validator: (links) =>
        ['textContent', 'href', 'eventLabel'].every((prop) =>
          Object.values(links).every(function hasProp(link) {
            return Object.prototype.hasOwnProperty.call(link, prop)
          })
        ),
    },
    eventCategory: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLinkList: false,
    }
  },
  methods: {
    toggleLinkList() {
      this.isLinkList = !this.isLinkList
    },
    closeLinkList() {
      this.isLinkList = false
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
