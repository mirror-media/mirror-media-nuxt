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
    <a
      class="footer-ad"
      :href="links.ad.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickAd"
      v-text="links.ad.textContent"
    />
    <a
      class="footer-activity"
      :href="links.activity.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickActivity"
      v-text="links.activity.textContent"
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
        },
        ad: {
          textContent: '廣告合作',
          href:
            'https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer ad'
          }
        },
        activity: {
          textContent: '活動專區',
          href: 'https://www.mirrormedia.mg/category/campaign',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer activity'
          }
        }
      }
    }
  },
  methods: {
    handleClickSubscribe() {
      this.$ga.event(this.links.subscribe.ga)
    },
    handleClickAd() {
      this.$ga.event(this.links.ad.ga)
    },
    handleClickActivity() {
      this.$ga.event(this.links.activity.ga)
    }
  }
}
</script>

<style lang="scss" scoped></style>
