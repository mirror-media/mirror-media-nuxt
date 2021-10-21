<template>
  <span @click="handleClick">
    {{ label }}
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    label: {
      type: String,
      require: true,
      default: '',
    },
  },
  computed: {
    ...mapGetters({
      sections: 'sections/displayedSections',
    }),
  },
  methods: {
    handleClick() {
      const sectionName =
        this.sections.find((section) => section.title === this.label).name || ''
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
