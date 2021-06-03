<template>
  <section class="header-nav">
    <nav class="header-nav__sections">
      <div
        v-for="section in activeSections"
        :key="`section-${section.id}`"
        :style="{
          minWidth: `calc(100% / ${sections.length + 1})`,
          borderTopColor: getColor(section),
        }"
        :class="[section.name, 'section']"
      >
        <a
          v-if="section.name !== 'videohub'"
          :href="`/section/${section.name}`"
          @click="sendGaClickEvent('header', `section ${section.name}`)"
        >
          <span v-text="section.title" />
        </a>
        <a
          v-else
          :href="`/section/${section.name}`"
          @click="sendGaClickEvent('header', `section ${section.name}`)"
        >
          <span v-text="section.title" />
        </a>
        <div class="dropdown">
          <a
            v-for="category in filterSectionCategories(section)"
            :key="`dropdown-${category.id}`"
            :href="getCategoryHref(section.name, category.name)"
            @click="sendGaClickEvent('header', `category ${category.name}`)"
            v-text="category.title"
          />
        </div>
      </div>
      <div
        :style="{ minWidth: `calc(100% / ${sections.length + 1})` }"
        class="section external"
      >
        <!--        <a>-->
        <!--          <span v-text="$t('HEADER.EXTERNAL')" />-->
        <!--        </a>-->
        <div class="dropdown">
          <a
            v-for="partner in activePartners"
            :key="`dropdown-${partner.id}`"
            :href="`/externals/${partner.name}`"
            @click="sendGaClickEvent('header', `external ${partner.name}`)"
            v-text="partner.display"
          />
        </div>
      </div>
    </nav>
    <nav class="header-nav__topics">
      <div class="topics-container">
        <a
          v-for="topic in activeTopics"
          :key="`topic-${topic.id}`"
          :href="`/topic/${topic.id}`"
          @click="sendGaClickEvent('header', `topic ${topic.name}`)"
          v-text="topic.name"
        />
      </div>
      <!--      <a-->
      <!--        href="/section/topic"-->
      <!--        class="more"-->
      <!--        @click="sendGaClickEvent('header', `topic ${$t('HEADER.MORE')}`)"-->
      <!--        v-text="$t('HEADER.MORE')"-->
      <!--      />-->
      <!--      <a-->
      <!--        href="https://voice.mirrorfiction.com/"-->
      <!--        class="link&#45;&#45;external mirrorvoice"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `section mirrorvoice`)"-->
      <!--      >-->
      <!--        <LazyImage-->
      <!--          src="/assets/mirrormedia/icon/mirrorvoice.png"-->
      <!--          :caption="$t('HEADER.MIRRORVOICE')"-->
      <!--        />-->
      <!--      </a>-->
      <!--      <a-->
      <!--        href="https://www.mirrorfiction.com/"-->
      <!--        class="link&#45;&#45;external mirrorfiction"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `section mirrorfiction`)"-->
      <!--      >-->
      <!--        <LazyImage-->
      <!--          src="/assets/mirrormedia/icon/mirrorfiction.png"-->
      <!--          :caption="$t('HEADER.MIRRORFICTION')"-->
      <!--        />-->
      <!--      </a>-->
      <!--      <a-->
      <!--        href="https://www.readr.tw/"-->
      <!--        class="link&#45;&#45;external readr"-->
      <!--        target="_blank"-->
      <!--        @click="sendGaClickEvent('header', `section readr`)"-->
      <!--      >-->
      <!--        <LazyImage-->
      <!--          src="/assets/mirrormedia/icon/readrlogo-gary.png"-->
      <!--          :caption="$t('HEADER.READR')"-->
      <!--        />-->
      <!--      </a>-->
    </nav>
  </section>
</template>
<script>
import { get } from 'lodash'
import LazyImage from '../common/LazyImage.vue'
import { SECTION_MAP } from '../../constants'
import { sendGaClickEvent } from '../../util/comm'

export default {
  name: 'HeaderNav',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    LazyImage,
  },
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
    filterSectionCategories(section) {
      const categories = section.categories || []
      return categories.filter((category) => category.id && category.title)
    },
    getCategoryHref(sectionName, categoryName) {
      if (sectionName === 'videohub') {
        return `/video_category/${categoryName}`
      }
      return `/category/${categoryName}`
    },
    getColor(section) {
      return get(SECTION_MAP, [section.id, 'bgcolor'])
    },
    sendGaClickEvent,
  },
}
</script>
<style lang="stylus" scoped>
$color-news = #30bac8
$color-entertainment = #bf3284
$color-businessmoney = #009045
$color-people = #efa256
$color-videohub = #969696
$color-international = #911f27
$color-foodtravel = #eac151
$color-mafalda = #662d8e
$color-culture = #009245
$color-carandwatch = #003153
$color-external = #fb9d18

.header-nav
  display none
  position relative
  z-index 100

@media (min-width: 1200px)
  .header-nav
    display block
    &__sections
      display flex
      height 45px
      padding 0 calc((100% - 1024px) / 2)
      background-color #064f77
      .section:hover
        .dropdown
          display block
      .section
        flex 1
        display inline-block // IE
        position relative
        text-align center
        border-top 3px solid #000
        &.external
          border-top-color $color-external
        a
          display block
        span
          color #fff
          line-height 42px
      .dropdown
        display none
        position absolute
        top 42px
        left 0
        z-index 10
        width 110px
        background-color #333
        > a
          display block
          padding 13px 10px // IE
          padding .8em .6em
          color #fff
          font-size 1rem
          text-align center
          line-height 1.3
    &__topics
      display flex
      height 45px
      padding 0 calc((100% - 1024px) / 2)
      background-color #fff
      box-shadow 0 0 5px 0 #ccc
      .topics-container
        display inline-block // IE
        max-width 582px
        vertical-align top // IE
        overflow hidden
        > a
          display inline-block // IE
          min-width 90px
          padding 0 .5em
          color rgba(0, 0, 0, .5)
          text-align center
          line-height 42px
          border-bottom 3px solid #000
          &:hover
            color #fff
            background-color #000
      .more
        display inline-block // IE
        min-width 90px
        padding 0 .5em
        margin 0 auto 0 0
        color rgba(0, 0, 0, .5)
        text-align center
        line-height 45px
        vertical-align top // IE
      .link--external
        display inline-block // IE
        min-width 40px
        padding 7.5px 0
        font-size 0
        text-align center
        vertical-align top // IE
        margin 0 10px
        img
          width auto
          height 30px
  // hover color effect
  .header-nav__sections
    .section:hover
      &.news
        background-color $color-news
        .dropdown
          > a:hover
            background-color $color-news
      &.entertainment
        background-color $color-entertainment
        .dropdown
          > a:hover
            background-color $color-entertainment
      &.businessmoney
        background-color $color-businessmoney
        .dropdown
          > a:hover
            background-color $color-businessmoney
      &.people
        background-color $color-people
        .dropdown
          > a:hover
            background-color $color-people
      &.videohub
        background-color $color-videohub
        .dropdown
          > a:hover
            background-color $color-videohub
      &.international
        background-color $color-international
        .dropdown
          > a:hover
            background-color $color-international
      &.foodtravel
        background-color $color-foodtravel
        .dropdown
          > a:hover
            background-color $color-foodtravel
      &.mafalda
        background-color $color-mafalda
        .dropdown
          > a:hover
            background-color $color-mafalda
      &.culture
        background-color $color-culture
        .dropdown
          > a:hover
            background-color $color-culture
      &.carandwatch
        background-color $color-carandwatch
        .dropdown
          > a:hover
            background-color $color-carandwatch
      &.external
        background-color $color-external
        .dropdown
          > a:hover
            background-color $color-external
</style>
