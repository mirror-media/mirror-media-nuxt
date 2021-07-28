<template>
  <footer class="footer">
    <nav class="footer-promotion-links">
      <a
        v-for="promotion in PROMOTION_LINKS"
        :key="promotion.name"
        :class="`footer-${promotion.name}`"
        :href="promotion.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="sendGa(`more ${promotion.name}`)"
      >
        {{ promotion.title }}
      </a>
    </nav>

    <nav class="footer-social-media-links">
      <a
        v-for="medium in SOCIAL_MEDIA_LINKS"
        :key="medium.name"
        :class="`footer-${medium.name}`"
        :href="medium.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="sendGa(`social ${medium.name}`)"
      >
        <img
          :src="require(`~/assets/${medium.name}@2x.png`)"
          :alt="medium.name"
        />
      </a>
    </nav>
  </footer>
</template>

<script>
import { PROMOTION_LINKS, SOCIAL_MEDIA_LINKS } from '~/constants/index'

export default {
  data() {
    return {
      PROMOTION_LINKS,
      SOCIAL_MEDIA_LINKS,
    }
  },

  methods: {
    sendGa(eventLabel) {
      this.$ga.event({
        eventCategory: 'footer',
        eventAction: 'click',
        eventLabel,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.footer {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 10px 20px;
  @include media-breakpoint-up(xl) {
    box-shadow: none;
    max-width: 1060px;
    padding: 15px 15px 50px 15px;
    margin: 0 auto;
    border-top: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.footer-promotion-links {
  color: rgba(0, 0, 0, 0.4);
  font-size: 19.2px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  a {
    display: flex;
    &:not(.footer-webauthorize) {
      padding-right: 8px;
    }
  }
  .footer-magazine,
  .footer-auth,
  .footer-download,
  .footer-discipline {
    display: none;
  }
  @include media-breakpoint-up(xl) {
    color: #34495e;
    font-size: 16px;
    font-weight: 700;
    a {
      + a {
        margin: 0 0 0 26px;
      }
    }
    .footer-magazine,
    .footer-auth,
    .footer-download,
    .footer-discipline {
      display: initial;
    }
    .footer-webauthorize,
    .footer-ad {
      display: none;
    }
  }
}

.footer-social-media-links {
  display: none;
  @include media-breakpoint-up(xl) {
    display: flex;
    a {
      display: inline-block;
      height: 20px;
      + a {
        margin: 0 0 0 26px;
      }
    }
    img {
      height: 100%;
    }
  }
}
</style>
