<template>
  <section class="header-sidebar">
    <button class="header-sidebar__close" @click="closeSidebar()">
      <!--      <img-->
      <!--        src="/assets/mirrormedia/icon/close_white@2x.png"-->
      <!--        :alt="$t('HEADER.CLOSE')"-->
      <!--      />-->
    </button>
    <div v-if="topics.length > 0" class="topics">
      <a
        v-for="topic in activeTopics"
        :key="`sidebar-topic-${topic.id}`"
        :href="`/topic/${topic.id}`"
        @click="sendGaClickEvent('header', `topic ${topic.name}`)"
        v-text="topic.name"
      />
      <!--      <a-->
      <!--        href="/section/topic"-->
      <!--        class="topic&#45;&#45;more"-->
      <!--        @click="sendGaClickEvent('header', `topic ${$t('HEADER.MORE')}`)"-->
      <!--        v-text="$t('HEADER.MORE')"-->
      <!--      />-->
    </div>
    <div class="sections">
      <div
        v-for="section in activeSections"
        :key="`sidebar-section-${section.id}`"
        :style="{ borderLeftColor: getColor(section) }"
        class="section"
      >
        <a
          v-if="section.name !== 'videohub'"
          :href="`/section/${section.name}`"
          @click="sendGaClickEvent('header', `section ${section.name}`)"
          v-text="section.title"
        />
        <a
          v-else
          :href="`/section/${section.name}`"
          @click="sendGaClickEvent('header', `section ${section.name}`)"
          v-text="section.title"
        />
        <div class="categories">
          <a
            v-for="category in filterSectionCategories(section)"
            :key="`sidebar-category-${category.id}`"
            :href="`/category/${category.name}`"
            @click="sendGaClickEvent('header', `category ${category.name}`)"
            v-text="category.title"
          />
        </div>
      </div>
      <div class="section external">
        <!--        <a v-text="$t('HEADER.EXTERNAL')" />-->
        <div v-if="partners.length > 0" class="categories">
          <a
            v-for="partner in activePartners"
            :key="`sidebar-partner-${partner.id}`"
            :href="`/externals/${partner.name}`"
            @click="sendGaClickEvent('header', `external ${partner.name}`)"
            v-text="partner.display"
          />
        </div>
      </div>
      <!--      <div class="section mirrorvoice">-->
      <!--        <a-->
      <!--          href="https://voice.mirrorfiction.com/"-->
      <!--          class="link&#45;&#45;external mirrorvoice"-->
      <!--          target="_blank"-->
      <!--          @click="sendGaClickEvent('header', `section mirrorvoice`)"-->
      <!--          v-text="$t('HEADER.MIRRORVOICE')"-->
      <!--        />-->
      <!--      </div>-->
      <!--      <div class="section mirrorfiction">-->
      <!--        <a-->
      <!--          href="https://www.mirrorfiction.com/"-->
      <!--          class="link&#45;&#45;external mirrorfiction"-->
      <!--          target="_blank"-->
      <!--          @click="sendGaClickEvent('header', `section mirrorfiction`)"-->
      <!--          v-text="$t('HEADER.MIRRORFICTION')"-->
      <!--        />-->
      <!--      </div>-->
      <!--      <div class="section">-->
      <!--        <a-->
      <!--          href="https://www.readr.tw/"-->
      <!--          class="link&#45;&#45;external readr"-->
      <!--          target="_blank"-->
      <!--          @click="sendGaClickEvent('header', `section readr`)"-->
      <!--          v-text="$t('HEADER.READR')"-->
      <!--        />-->
      <!--      </div>-->
      <!--    </div>-->
      <!--    <div class="others">-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.SUBSCRIBE"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `more subscribe`)"-->
      <!--        v-text="$t('HEADER.SUBSCRIBE')"-->
      <!--      />-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.MAGAZINE"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `more magazine`)"-->
      <!--        v-text="$t('HEADER.MAGAZINE')"-->
      <!--      />-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.AUTH"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `more auth`)"-->
      <!--        v-text="$t('HEADER.AUTH')"-->
      <!--      />-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.AD"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `more ad`)"-->
      <!--        v-text="$t('HEADER.AD')"-->
      <!--      />-->
      <!--      <a-->
      <!--        href="/category/campaign"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `more campaign`)"-->
      <!--        v-text="$t('HEADER.CAMPAIGN')"-->
      <!--      />-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.DOWNLOADAPP"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `more download`)"-->
      <!--        v-text="$t('HEADER.DOWNLOADAPP')"-->
      <!--      />-->
      <!--    </div>-->
      <!--    <div class="social-media">-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.LINE"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `social line`)"-->
      <!--        ><img-->
      <!--          class="sprite sprite-line"-->
      <!--          src="/assets/mirrormedia/transperent.png"-->
      <!--          :alt="$t('HEADER.LINE')"-->
      <!--      /></a>-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.WEIBO"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `social weibo`)"-->
      <!--        ><img-->
      <!--          class="sprite sprite-weibo"-->
      <!--          src="/assets/mirrormedia/transperent.png"-->
      <!--          :alt="$t('HEADER.WEIBO')"-->
      <!--      /></a>-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.FACEBOOK"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `social facebook`)"-->
      <!--        ><img-->
      <!--          class="sprite sprite-facebook"-->
      <!--          src="/assets/mirrormedia/transperent.png"-->
      <!--          :alt="$t('HEADER.FACEBOOK')"-->
      <!--      /></a>-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.INSTAGRAM"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `social instagram`)"-->
      <!--        ><img-->
      <!--          class="sprite sprite-instagram"-->
      <!--          src="/assets/mirrormedia/transperent.png"-->
      <!--          :alt="$t('HEADER.INSTAGRAM')"-->
      <!--      /></a>-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.FEED"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `social rss`)"-->
      <!--        ><img-->
      <!--          class="sprite sprite-rss"-->
      <!--          src="/assets/mirrormedia/transperent.png"-->
      <!--          :alt="$t('HEADER.RSS')"-->
      <!--      /></a>-->
      <!--      <a-->
      <!--        :href="SOCIAL_LINK.EMAIL"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `social mail`)"-->
      <!--        ><img-->
      <!--          class="sprite sprite-mail"-->
      <!--          src="/assets/mirrormedia/transperent.png"-->
      <!--          :alt="$t('HEADER.EMAIL')"-->
      <!--      /></a>-->
    </div>
  </section>
</template>
<script>
import { get } from 'lodash'
import { SECTION_MAP, SOCIAL_LINK } from '../../constants'
import { sendGaClickEvent } from '../../util/comm'

export default {
  name: 'HeaderSidebar',
  props: {
    partners: {
      type: Array,
      default() {
        return []
      },
    },
    sections: {
      type: Array,
      default() {
        return []
      },
    },
    topics: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      SOCIAL_LINK,
    }
  },
  computed: {
    activePartners() {
      return this.partners.filter(
        (partner) => partner.public && partner.id && partner.display
      )
    },
    activeSections() {
      return this.sections.filter((section) => section.id && section.name)
    },
    activeTopics() {
      return this.topics.filter((topic) => topic.id && topic.name)
    },
  },
  methods: {
    closeSidebar() {
      this.$emit('closeSidebar')
      sendGaClickEvent('header', 'menu close')
    },
    filterSectionCategories(section) {
      const categories = section.categories || []
      return categories.filter((category) => category.id && category.title)
    },
    getColor(section) {
      return get(SECTION_MAP, [section.id, 'bgcolor'])
    },
    sendGaClickEvent,
  },
}
</script>
<style lang="stylus" scoped>
.header-sidebar
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  z-index 1000
  padding calc(5% + 30px) 5% 5%
  background-color #333
  overflow-y auto
  &__close
    position absolute
    top 1em
    right 1em
    width 20px
    height 20px
    padding 0
    background-color transparent
    border none
    img
      width 100%
      height 100%

.topics
  position relative
  left -0.5em
  width calc(100% + 1em)
  display flex
  flex-wrap wrap
  a
    margin .5em 0
    padding 0 .5em
    color #fff
    font-size 1rem
    border-right 1px solid #fff
    &:last-child
      border-right none

.sections
  margin-top 1em
  .section
    padding 1em 0 1em 1em
    border-left 3px solid #000
    border-bottom 1px solid #7e7e7e
    &:last-of-type
      border-bottom none
    &.external
      border-left-color #fb9d18
    &.mirrorvoice
      border-left-color #FF521D
    &.mirrorfiction
      border-left-color #968375
    > a
      color #fff
      font-size 1.2rem
      font-weight 300
  .categories
    display flex
    flex-wrap wrap
    margin-top 1em
    > a
      margin .2em 1em .2em 0
      color #969696
      font-size 1.1rem
      font-weight 300
      &:last-child
        margin-right 0
.others
  display flex
  justify-content space-between
  flex-wrap wrap
  margin-top 1em
  > a
    width calc(50% - 5px)
    margin .5em 0
    padding .2em 0
    color #969696
    font-size 1rem
    font-weight 300
    text-align center
    border 1px solid #969696

.social-media
  display flex
  justify-content space-between
  margin-top 1em

.sprite
  background-image url('/assets/mirrormedia/icon/socialMedia_white@2x.png')
  background-repeat no-repeat
  background-size 126px 120px
  display block
  &-facebook
    width 20px
    height 20px
    background-position -106px -100px
  &-instagram
    width 20px
    height 20px
    background-position -46px -40px
  &-line
    width 20px
    height 20px
    background-position -86px -80px
  &-mail
    width 26px
    height 20px
    background-position 0 0
  &-rss
    width 20px
    height 20px
    background-position -26px -20px
  &-weibo
    width 20px
    height 20px
    background-position -66px -60px
</style>
