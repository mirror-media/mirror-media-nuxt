<template>
  <section class="header-nav-section">
    <div class="wrapper">
      <div class="section section--home active">
        <nuxt-link to="/">首頁</nuxt-link>
      </div>

      <div
        v-for="section in featuredSections"
        :key="section.id"
        :class="`section section--${section.name}`"
      >
        <nuxt-link :to="`/section/${section.name}`">
          {{ section.title }}
        </nuxt-link>
        <div class="section__dropdown">
          <nuxt-link
            v-for="category in section.categories"
            :key="category.id"
            :to="`/category/${category.name}`"
          >
            {{ category.title }}
          </nuxt-link>
        </div>
      </div>

      <div class="section section--external">
        <div>健康醫療</div>
        <div class="section__dropdown">
          <nuxt-link
            v-for="partner in publicPartner"
            :key="partner.id"
            :to="`/externals/${partner.name}`"
          >
            {{ partner.display }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'UIHeaderNavSection',
  props: {
    sections: {
      type: Array,
      required: true,
    },
    partners: {
      type: Array,
      required: true,
    },
  },
  computed: {
    featuredSections() {
      // todo why return this.sections.filter(section => section.isFeatured && section.id && section.name)
      return this.sections.filter((section) => section.isFeatured)
    },
    publicPartner() {
      return this.partners.filter((partner) => partner.public)
    },
  },
}
</script>

<style lang="sass" scoped>
$sections-color: ("news": #30bac8, "entertainment": #bf3284, "businessmoney": #009045, "people": #efa256, "videohub": #969696, "international": #911f27, "foodtravel": #eac151, "mafalda": #662d8e, "culture": #009245, "carandwatch": #003153, "external": #ee5a24)

.header-nav-section
  font-size: 14px
  // to hide scrollbar
  height: 28px
  overflow: hidden

  display: flex
  justify-content: center
  @media (min-width: 1200px)
    background-color: #064f77
    font-size: 16px
    height: auto
    overflow: visible
  .wrapper
    // to hide scrollbar
    height: 48px

    display: flex
    align-items: flex-start
    justify-content: flex-start
    overflow-x: auto
    max-width: 1024px
    margin-left: auto
    margin-right: auto
    text-align: center
    @media (min-width: 1200px)
      width: 100%
      height: auto
      justify-content: center
      overflow: visible
  .section
    flex: 0 0 auto
    padding: 7px 11px 5px 11px
    position: relative
    display: flex
    align-items: center
    justify-content: center
    color: #808080
    cursor: pointer
    user-select: none
    line-height: 1.15
    @media (min-width: 1200px)
      color: #fff
      padding: 12px 0
      min-width: calc(100% / 11)
      border-top-width: 3px
      border-top-style: solid
      @each $name, $color in $sections-color
        &--#{$name}
          border-top-color: $color
          &:hover
            background-color: $color
          & .section__dropdown a:hover
            background-color: $color
      &:hover .section__dropdown
        display: block
    @media (max-width: 1199.98px)
      &:hover
        color: #34495e
      &.active
        color: #34495e
        &::after
          content: ''
          position: absolute
          left: 50%
          transform: translateX(-50%)
          bottom: 0
          height: 3px
          width: calc(100% - 22px)
          background-color: #34495e
    &--home
      @media (min-width: 1200px)
        display: none
    &__dropdown
      position: absolute
      display: none
      // todo width: 110px
      width: 100%
      left: 0
      top: 100%
      background-color: #333
      text-align: center
      a
        line-height: 1.3
        display: block
        padding: 12px 10px
</style>
