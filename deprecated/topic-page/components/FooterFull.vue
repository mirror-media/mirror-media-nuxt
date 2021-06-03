<template>
  <footer class="footerFull">
    <div class="footerFull__logo">
      <router-link
        :to="'/section/' + this.sectionName"
        :style="{ height: getSectionLogoHeight() + 'px' }"
      >
        <img
          :src="getSectionLogoUrl()"
          :style="{
            width: getSectionLogoWidth() + 'px',
            height: getSectionLogoHeight() + 'px',
          }"
        />
      </router-link>
    </div>
    <div class="footerFull__menu">
      <router-link
        v-for="(item, i) in menuItem.section"
        :key="`${i}-${Date.now()}`"
        :to="item.href"
        v-text="item.title"
      />
      <router-link
        v-for="(item, i) in menuItem.category"
        :key="`${i}-${Date.now()}`"
        :to="item.href"
        v-text="item.title"
      />
    </div>
    <div class="footerFull__vertDivider" />
    <div class="footerFull__link">
      <div class="footerFull__link--subscribe">
        <a
          :href="socialLink.SUBSCRIBE"
          target="_blank"
          @click="sendGaClickEvent('footer', 'footer subscribe')"
          >訂閱鏡週刊</a
        >
        -
        <a
          :href="socialLink.AD"
          @click="sendGaClickEvent('footer', 'footer ad')"
          >廣告合作</a
        >
      </div>
      <div class="footerFull__link--horizDivider" />
      <div class="footerFull__link--socialMedia">
        <a
          :href="socialLink.FACEBOOK"
          target="_blank"
          @click="sendGaClickEvent('footer', 'footer fb')"
          ><img
            class="facebook"
            src="/assets/mirrormedia/icon/facebook_white.png"
            alt="Facebook"
        /></a>
        <a
          :href="socialLink.LINE"
          target="_blank"
          @click="sendGaClickEvent('footer', 'footer line')"
          ><img
            class="line"
            src="/assets/mirrormedia/icon/line_white.png"
            alt="Line"
        /></a>
        <a
          :href="socialLink.WEIBO"
          target="_blank"
          @click="sendGaClickEvent('footer', 'footer weibo')"
          ><img
            class="weibo"
            src="/assets/mirrormedia/icon/weibo_white.png"
            alt="微博"
        /></a>
      </div>
    </div>
  </footer>
</template>
<script>
import _ from 'lodash'
import { SOCIAL_LINK } from '../constants/index'
import { sendGaClickEvent } from '../util/comm'

export default {
  name: 'FooterFull',
  props: {
    commonData: {
      type: Object,
      default: () => ({}),
    },
    sectionName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      socialLink: SOCIAL_LINK,
    }
  },
  computed: {
    menuItem() {
      const menuItem = {}
      menuItem.section = []
      menuItem.category = []
      if (!this.commonData.sections) {
        return menuItem
      }
      _.forEach(this.commonData.sections.items, (s) => {
        s.href = '/section/' + s.name
        s.isFeatured && menuItem.section.push(s)
        _.forEach(s.categories, (c) => {
          c.href = '/category/' + c.name
          c.section = s.name
          c.isFeatured && menuItem.category.push(c)
        })
      })
      return menuItem
    },
    sectionLogo() {
      return _.get(
        _.find(_.get(this.commonData, ['sections', 'items']), {
          name: this.sectionName,
        }),
        ['image'],
        null
      )
    },
  },
  methods: {
    getSectionLogoUrl() {
      return _.get(this.sectionLogo, ['image', 'url'])
        ? _.get(this.sectionLogo, ['image', 'url'])
        : '/assets/mirrormedia/logo.svg'
    },
    getSectionLogoWidth() {
      return _.get(this.sectionLogo, ['image', 'width'])
    },
    getSectionLogoHeight() {
      return _.get(this.sectionLogo, ['image', 'height'])
    },
    sendGaClickEvent,
  },
}
</script>
<style lang="stylus" scoped>

.footerFull
  display flex
  flex-direction column
  justify-content space-between
  align-items stretch
  padding 40px 32px
  background-color #000

  a
    display block

  &__logo
    display flex
    justify-content center
    align-items center
    margin-bottom 40px

  &__menu
    display flex
    flex-wrap wrap
    width 100%
    margin-bottom 35px
    > a
      width 33%
      margin 15px 0
      font-size 18px
      font-weight 300
      color #fff
      text-align center

  &__vertDivider
    display none
    width 1px
    background-color #6e6e6e

  &__link
    display flex
    justify-content center
    align-items center
    flex-direction column
    &--subscribe
      margin-bottom 35px
      a
        display inline-block
        color #9fa1a0
        font-size 15px
    &--horizDivider
      display block
      width 100%
      height 1px
      margin-bottom 25px
      background-color #6e6e6e
    &--socialMedia
      display flex
      justify-content space-around
      width 100%

      > a
        height 22px

      .facebook, .line, .weibo
        height 22px

@media (min-width 1200px)
  .footerFull
    flex-direction row
    align-items stretch
    padding 25px 95px
    &__logo
      margin-bottom 0
    &__menu
      width 445px
      margin-bottom 0
      > a
        width 25%
        font-size 15px
        text-align left
    &__vertDivider
      display block
    &__link
      width 180px
      &--subscribe
        margin-bottom 25px
      &--horizDivider
        display none
      &--socialMedia
        justify-content space-between
</style>
