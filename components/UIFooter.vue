<template>
  <footer class="footer">
    <nav class="footer-other-links">
      <a
        v-for="other in others"
        :key="other.name"
        :class="`footer-${other.name}`"
        :href="other.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="sendGA(`more ${other.name}`)"
      >
        {{ other.title }}
      </a>
    </nav>

    <nav class="footer-social-media-links">
      <a
        v-for="medium in socialMedia"
        :key="medium.name"
        :class="`footer-${medium.name}`"
        :href="medium.href"
        target="_blank"
        rel="noopener noreferrer"
        @click="sendGA(`social ${medium.name}`)"
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
import { OTHER_LINKS, SOCIAL_MEDIA_LINKS } from '~/constants/index'

export default {
  computed: {
    others() {
      return OTHER_LINKS
    },
    socialMedia() {
      return SOCIAL_MEDIA_LINKS
    },
  },
  methods: {
    sendGA(eventLabel) {
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
    padding: 15px 15px 50px 15px;
    border-top: 2px solid #000;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.footer-other-links {
  color: rgba(0, 0, 0, 0.4);
  font-size: 19.2px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  a {
    display: flex;
    &:not(.footer-campaign)::after {
      content: '-';
      padding-right: 4px;
      padding-left: 4px;
    }
  }
  .footer-magazine,
  .footer-auth,
  .footer-download {
    display: none;
  }
  @include media-breakpoint-up(xl) {
    color: #34495e;
    font-size: 16px;
    font-weight: 700;
    a {
      &:not(.footer-campaign)::after {
        content: none;
      }
      + a {
        margin: 0 0 0 26px;
      }
    }
    .footer-magazine,
    .footer-auth,
    .footer-download {
      display: initial;
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
