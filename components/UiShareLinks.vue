<template>
  <div class="article-info__share-links-wrapper share-links-wrapper">
    <UiShareFb
      class="share-link"
      data-user-behavior-description="share-facebook"
    />
    <UiShareLine
      class="share-link"
      data-user-behavior-description="share-line"
    />
  </div>
</template>

<script>
import UiShareFb from '~/components/UiShareFb.vue'
import UiShareLine from '~/components/UiShareLine.vue'

export default {
  components: {
    UiShareFb,
    UiShareLine,
  },
}
</script>

<style lang="scss" scoped>
.share-links-wrapper {
  min-width: 84px;
  width: 84px;
  height: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.share-link {
  display: inline-block;
  width: 36px;
  height: 36px;
}
</style>
