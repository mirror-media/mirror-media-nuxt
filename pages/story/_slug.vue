<template>
  <div class="story-container">
    <UIStoryBody :story="story" />
    <ContainerFullScreenAds />
  </div>
</template>

<script>
import UIStoryBody from '~/components/UIStoryBody.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'

export default {
  name: 'Story',
  components: {
    UIStoryBody,
    ContainerFullScreenAds,
  },
  async fetch() {
    const response = await this.$fetchPosts({
      slug: this.$route.params.slug,
      isAudioSiteOnly: false,
      clean: 'content',
    })
    this.story = response.items[0] ?? {}
  },
  data() {
    return {
      story: {},
    }
  },
}
</script>

<style lang="scss" scoped>
.story-container {
  max-width: 1160px;
  @include media-breakpoint-up(lg) {
    margin: 0 auto;
    padding: 30px 50px;
    background-color: #fff;
  }
}
</style>
