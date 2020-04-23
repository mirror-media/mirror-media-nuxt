<template>
  <footer class="footer">
    <nav class="footer-text-links">
      <a
        class="footer-subscribe"
        :href="links.subscribe.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.subscribe.ga)"
        v-text="links.subscribe.textContent"
      />
      <a
        class="footer-ad"
        :href="links.ad.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.ad.ga)"
        v-text="links.ad.textContent"
      />
      <a
        class="footer-activity"
        :href="links.activity.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.activity.ga)"
        v-text="links.activity.textContent"
      />
      <a
        class="footer-download-app"
        :href="links.downloadApp.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.downloadApp.ga)"
        v-text="links.downloadApp.textContent"
      />
      <a
        class="footer-auth"
        :href="links.auth.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.auth.ga)"
        v-text="links.auth.textContent"
      />
    </nav>
    <nav class="footer-icon-links">
      <a
        class="footer-line"
        :href="links.line.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.line.ga)"
      >
        <img :src="links.line.imagePath" alt="line" />
      </a>
      <a
        class="footer-weibo"
        :href="links.weibo.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.weibo.ga)"
      >
        <img :src="links.weibo.imagePath" alt="weibo" />
      </a>
      <a
        class="footer-facebook"
        :href="links.facebook.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.facebook.ga)"
      >
        <img :src="links.facebook.imagePath" alt="facebook" />
      </a>
      <a
        class="footer-instagram"
        :href="links.instagram.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.instagram.ga)"
      >
        <img :src="links.instagram.imagePath" alt="instagram" />
      </a>
      <a
        class="footer-rss-feed"
        :href="links.rssFeed.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.rssFeed.ga)"
      >
        <img :src="links.rssFeed.imagePath" alt="rss-feed" />
      </a>
      <a
        class="footer-email"
        :href="links.email.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="handleSendGA(links.email.ga)"
      >
        <img :src="links.email.imagePath" alt="email" />
      </a>
    </nav>
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
            eventLabel: 'footer subscribe',
          },
        },
        ad: {
          textContent: '廣告合作',
          href:
            'https://www.mirrormedia.mg/story/ad1018001/index.html?utm_source=mm&utm_medium=footer&utm_campaign=salesteam',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer ad',
          },
        },
        activity: {
          textContent: '活動專區',
          href: 'https://www.mirrormedia.mg/category/campaign',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer activity',
          },
        },
        downloadApp: {
          textContent: '下載ＡＰＰ',
          href: 'https://www.mirrormedia.mg/story/20161228corpmkt001/',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer download',
          },
        },
        auth: {
          textContent: '內容授權',
          href: 'https://www.mirrormedia.mg/story/webauthorize/',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer auth',
          },
        },
        line: {
          imagePath: require('~/assets/line@2x.png'),
          href: 'https://line.me/R/ti/p/%40cuk1273e',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer line',
          },
        },
        weibo: {
          imagePath: require('~/assets/weibo@2x.png'),
          href: 'http://www.weibo.com/u/6030041924?is_all=1',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer weibo',
          },
        },
        facebook: {
          imagePath: require('~/assets/facebook@2x.png'),
          href: 'https://www.facebook.com/mirrormediamg/',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer facebook',
          },
        },
        instagram: {
          imagePath: require('~/assets/instagram@2x.png'),
          href: 'https://www.instagram.com/mirror_media/',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer instagram',
          },
        },
        rssFeed: {
          imagePath: require('~/assets/feed@2x.png'),
          href: 'https://www.mirrormedia.mg/rss/rss.xml',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer feed',
          },
        },
        email: {
          imagePath: require('~/assets/mail@2x.png'),
          href: 'mailto:mirror885@mirrormedia.mg',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer email',
          },
        },
      },
      gaError: 'please provide valid param in handleSendGA',
    }
  },
  methods: {
    handleSendGA(param = {}) {
      const paramValid =
        Object.keys(param).length !== 0 &&
        'eventCategory' in param &&
        'eventAction' in param &&
        'eventLabel' in param
      if (!paramValid) {
        throw new Error(this.gaError)
      }

      this.$ga.event(param)
    },
  },
}
</script>

<style lang="sass" scoped>
.footer
  box-shadow: 0 0 10px rgba(0, 0, 0, .2)
  padding: 10px 20px
  @media (min-width: 1200px)
    box-shadow: none
    padding: 15px 15px 50px 15px
    border-top: 2px solid #000
    display: flex
    align-items: center
    justify-content: space-between

.footer-text-links
  color: rgba(0, 0, 0, .4)
  text-align: center
  font-size: 19.2px
  a:not(:first-child)
    &::before
      content: '-'
      padding: 0 4px 0 0
  .footer-download-app, .footer-auth
    display: none
  @media (min-width: 1200px)
    color: #34495e
    text-align: left
    font-size: 16px
    font-weight: 700
    a:not(:first-child)
      &::before
        display: none
    .footer-download-app, .footer-auth
      display: initial
    a + a
      margin: 0 0 0 26px

.footer-icon-links
  display: none
  @media (min-width: 1200px)
    display: flex
    a
      display: inline-block
      height: 20px
      img
        height: 100%
    a + a
      margin: 0 0 0 26px
</style>
