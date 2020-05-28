<template>
  <div
    :data-channelid="channelId"
    class="g-ytsubscribe"
    data-layout="full"
    data-count="hidden"
  />
</template>
<script>
export default {
  name: 'UIYoutubeSubscribe',
  props: {
    channelId: {
      type: String,
      required: true,
    },
  },
}
</script>
<style lang="scss" scoped></style>
