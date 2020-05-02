<template>
  <section>
    <nuxt-link
      v-for="topic in topics"
      :key="topic.id"
      :to="`/topic/${topic.id}`"
    >
      {{ topic.name }}
    </nuxt-link>

    <nuxt-link to="/section/topic">更多</nuxt-link>

    <a href="https://voice.mirrorfiction.com/" target="_blank">
      <img src="~/assets/mirrorvoice.png" alt="鏡好聽" />
    </a>
    <a href="https://www.mirrorfiction.com/" target="_blank">
      <img src="~/assets/mirrorfiction.png" alt="鏡文學" />
    </a>
    <a href="https://www.readr.tw/" target="_blank">
      <img src="~/assets/readrlogo-gary.png" alt="READR 讀+" />
    </a>
  </section>
</template>

<script>
export default {
  name: 'UIHeaderNavTopic',
  props: {
    topics: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style lang="sass" scoped></style>
