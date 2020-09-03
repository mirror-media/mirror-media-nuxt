<template>
  <div class="story-container">
    <UIStoryBody :story="story" />
  </div>
</template>

<script>
import UIStoryBody from '~/components/UIStoryBody.vue'

export default {
  name: 'Story',
  components: {
    UIStoryBody,
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
