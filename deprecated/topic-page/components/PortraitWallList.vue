<template>
  <section class="portraitWallList">
    <div
      v-for="(item, index) in images"
      :key="`imageGroup-${index}`"
      class="portraitWallList__imageGroup"
      :class="[index % 2 === 0 ? 'color' : '']"
    >
      <div
        v-for="(image, index) in item"
        :key="`block-${index}`"
        class="portraitWallList__block"
        :class="[getOrder(image) % 2 === 0 ? '' : 'color']"
      >
        <a
          :href="getHref(image)"
          target="_blank"
          class="portraitWallList__block--image"
          :style="{ backgroundImage: 'url(' + getImage(image) + ')' }"
        >
          <p v-text="getTitle(image, false)" />
        </a>
        <div class="portraitWallList__block--content">
          <h2>
            <a
              :href="getHref(image)"
              target="_blank"
              v-text="getValue(image, ['description'])"
            />
          </h2>
          <p>
            <a target="_blank" v-text="getTitle(image, true)" />
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import { getTruncatedVal, getValue } from '../util/comm'

export default {
  name: 'PortraitWallList',
  props: ['articles', 'initialMediaData'],
  computed: {
    images() {
      return _.chunk(
        _.sortBy(this.initialMediaData, [
          function (o) {
            return _.toNumber(_.split(o.keywords, '-')[0])
          },
        ]),
        5
      )
    },
  },
  methods: {
    getHref(item) {
      return `/story/${_.split(_.get(item, ['keywords']), '-')[1]}`
    },
    getImage(item) {
      return _.get(item, ['image', 'resizedTargets', 'desktop', 'url'])
    },
    getOrder(item) {
      return _.split(_.get(item, ['keywords']), '-')[0]
    },
    getTitle(item, needComplete) {
      const slug = _.split(_.get(item, ['keywords']), '-')[1]
      if (needComplete) {
        return _.get(_.find(this.articles, { slug }), ['title'])
      }
      return getTruncatedVal(
        _.get(_.find(this.articles, { slug }), ['title']),
        19
      )
    },
    getValue,
  },
}
</script>
<style lang="stylus" scoped>

.portraitWallList
  &__block
    display flex
    justify-content space-between
    width 100%
    padding 5% 7%
    .portraitWallList__block--image
      order 2
    .portraitWallList__block--content
      order 1

    &.color
      .portraitWallList__block--image
        order 1
      .portraitWallList__block--content
        order 2
        a
          color #fff
    &--image
      position relative
      flex 0 1 auto
      width 47%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover
      border-radius 3px
      &::after
        content ''
        display block
        width 100%
        padding-top 100%
      img
        width 100%
        height auto
      p
        display none
    &--content
      display flex
      flex-direction column
      justify-content center
      width 47%
      h2
        margin 0 0 .5em
        font-size 1.2rem
        letter-spacing 1px
      p
        margin 0
        line-height 1.3

@media (min-width: 600px)
  .portraitWallList
    &__block
      padding 5% 10%
      &--image
        width calc(50% - 10px)
      &--content
        width calc(50% - 10px)

@media (min-width:900px)
  .portraitWallList
    &__imageGroup
      display flex
      justify-content flex-start
      padding 1em calc(15% + 25px)
      .portraitWallList__block--image
        order 1
      .portraitWallList__block--content
        order 1
      &.color
        a
          color #fff !important
    &__block
      flex-direction column
      width 18%
      padding 0
      margin 0 5px
      // padding-left 1%
      // padding-right 1%
      &--image
        position relative
        width 100%
        font-size .8rem
        &:hover
          p
            display flex
            justify-content center
            align-items center
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            margin 0
            padding 25% 10%
            color #fff
            text-align justify
            line-height 1.3
            background-color rgba(0, 0, 0, .7)
      &--content
        flex-direction row
        justify-content center
        align-items center
        width 100%
        padding .5em 0
        h2
          margin 0
        p
          display none

@media (min-width:1200px)
  .portraitWallList
    &__block
      &--image
        font-size 1rem
</style>
