<template>
  <section>
    <nuxt-link to="/">首頁</nuxt-link>
    <nuxt-link
      v-for="section in featuredSections"
      :key="section.id"
      :to="`/section/${section.name}`"
    >
      {{ section.title }}
    </nuxt-link>
  </section>
</template>

<script>
export default {
  name: 'UIHeaderNavSection',
  props: {
    sections: {
      type: Array,
      required: true,
    },
  },
  computed: {
    featuredSections() {
      // why return this.sections.filter(section => section.isFeatured && section.id && section.name)
      return this.sections.filter((section) => section.isFeatured)
    },
  },
}
</script>

<style lang="sass" scoped></style>
