<template>
  <div class="subcribe-button">{{ title }}</div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      isRequired: true,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.subcribe-button {
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff;
  padding: 13px 97px 12px;
  border-radius: 4px;
  background-color: #1b7aae;
  cursor: pointer;

  @include media-breakpoint-up(sm) {
    padding: 15px 97px 15px;
  }
}
</style>
