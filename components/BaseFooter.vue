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
    <a
      class="footer-download-app"
      :href="links.downloadApp.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickDownloadApp"
      v-text="links.downloadApp.textContent"
    />
    <a
      class="footer-auth"
      :href="links.auth.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickAuth"
      v-text="links.auth.textContent"
    />
    <a
      class="footer-line"
      :href="links.line.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickLine"
    >
      <img :src="links.line.imagePath" alt="line" />
    </a>
    <a
      class="footer-weibo"
      :href="links.weibo.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickWeibo"
    >
      <img :src="links.weibo.imagePath" alt="weibo" />
    </a>
    <a
      class="footer-facebook"
      :href="links.facebook.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickFacebook"
    >
      <img :src="links.facebook.imagePath" alt="facebook" />
    </a>
    <a
      class="footer-instagram"
      :href="links.instagram.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickInstagram"
    >
      <img :src="links.instagram.imagePath" alt="instagram" />
    </a>
    <a
      class="footer-rss-feed"
      :href="links.rssFeed.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickRssFeed"
    >
      <img :src="links.rssFeed.imagePath" alt="rss-feed" />
    </a>
    <a
      class="footer-email"
      :href="links.email.href"
      target="_blank"
      rel="noopener noreferrer"
      @click="handleClickEmail"
    >
      <img :src="links.email.imagePath" alt="email" />
    </a>
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
        },
        downloadApp: {
          textContent: '下載ＡＰＰ',
          href: 'https://www.mirrormedia.mg/story/20161228corpmkt001/',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer download'
          }
        },
        auth: {
          textContent: '內容授權',
          href: 'https://www.mirrormedia.mg/story/webauthorize/',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer auth'
          }
        },
        line: {
          imagePath: require('~/assets/line@2x.png'),
          href: 'https://line.me/R/ti/p/%40cuk1273e',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer line'
          }
        },
        weibo: {
          imagePath: require('~/assets/weibo@2x.png'),
          href: 'http://www.weibo.com/u/6030041924?is_all=1',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer weibo'
          }
        },
        facebook: {
          imagePath: require('~/assets/facebook@2x.png'),
          href: 'https://www.facebook.com/mirrormediamg/',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer facebook'
          }
        },
        instagram: {
          imagePath: require('~/assets/instagram@2x.png'),
          href: 'https://www.instagram.com/mirror_media/',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer instagram'
          }
        },
        rssFeed: {
          imagePath: require('~/assets/feed@2x.png'),
          href: 'https://www.mirrormedia.mg/rss/rss.xml',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer feed'
          }
        },
        email: {
          imagePath: require('~/assets/mail@2x.png'),
          href: 'mailto:mirror885@mirrormedia.mg',
          ga: {
            eventCategory: 'footer',
            eventAction: 'click',
            eventLabel: 'footer email'
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
    },
    handleClickDownloadApp() {
      this.$ga.event(this.links.downloadApp.ga)
    },
    handleClickAuth() {
      this.$ga.event(this.links.auth.ga)
    },
    handleClickLine() {
      this.$ga.event(this.links.line.ga)
    },
    handleClickWeibo() {
      this.$ga.event(this.links.weibo.ga)
    },
    handleClickFacebook() {
      this.$ga.event(this.links.facebook.ga)
    },
    handleClickInstagram() {
      this.$ga.event(this.links.instagram.ga)
    },
    handleClickRssFeed() {
      this.$ga.event(this.links.rssFeed.ga)
    },
    handleClickEmail() {
      this.$ga.event(this.links.email.ga)
    }
  }
}
</script>

<style lang="scss" scoped></style>
