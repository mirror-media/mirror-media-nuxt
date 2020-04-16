<template>
  <footer>
    <a
      class="footer-subscribe"
      :href="links.subscribe.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickSubscribe"
      v-text="links.subscribe.textContent"
    />
  </footer>
</template>

<script>
export default {
  data() {
    return {
      links: {
        subscribe: {
          textContent: '訂閱鏡週刊',
          href:
            'https://docs.google.com/forms/d/1es1wqWfhwJn2sxDLc-6NRVokGn_fU0_M2YffhKMlcyM/viewform',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer subscribe'
          }
        }
      }
    }
  },
  methods: {
    handleClickSubscribe() {
      this.$ga.event(this.links.subscribe.ga)
    }
  }
}
</script>

<style lang="scss" scoped></style>
