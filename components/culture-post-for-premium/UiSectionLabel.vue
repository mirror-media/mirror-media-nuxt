<template>
  <span @click="handleClick">
    {{ label }}
  </span>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      require: true,
      default: '',
    },
    href: {
      type: String,
      default: null,
    },
  },
  methods: {
    async handleClick() {
      if (this.href) {
        location.assign(this.href)
        return
      }

      const data = await this.$fetchMemberSectionsArticles()
      const sectionName =
        data.find((section) => section.title === this.label)?.name || ''
      location.assign(`/premiumsection/${sectionName}`)
    },
  },
}
</script>

<style lang="scss" scoped>
span {
  font-size: 18px;
  line-height: 27px;
  color: #054f77;
  cursor: pointer;
}
</style>
