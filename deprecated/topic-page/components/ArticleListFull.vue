<template>
  <section class="articleListFull">
    <div class="articleListFull-post-container">
      <h2>最新新聞 Latest Stories</h2>
      <div class="articleListFull-posts">
        <template v-for="item in articles">
          <div
            :key="`articleListFull-${getValue(item, ['title'])}`"
            class="articleListFull-post"
          >
            <a
              :href="getHref(item)"
              target="_blank"
              class="articleListFull-post__img"
            >
              <figure
                :style="{
                  backgroundImage: 'url(' + getImage(item, 'mobile') + ')',
                }"
                :title="getValue(item, ['title'])"
              />
            </a>
            <div class="articleListFull-post__content">
              <h2>
                <a :href="getHref(item)" target="_blank" v-text="item.title" />
              </h2>
              <div class="articleListFull-post__meta">
                <span
                  v-show="getAuthor(item, 'writers')"
                  class="articleListFull-post__meta--author"
                  v-html="getAuthor(item, 'writers') + ' ｜ '"
                />
                <span
                  class="articleListFull-post__meta--date"
                  v-text="dayjs(new Date(item.publishedDate)).format('Y.MM.DD')"
                />
              </div>
              <p class="articleListFull-post__brief">
                <a
                  :href="getHref(item)"
                  target="_blank"
                  v-text="getBrief(item, 70)"
                />
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import { getAuthor, getBrief, getHref, getImage, getValue } from '../util/comm'
import dayjs from '~/utils/dayjs'

export default {
  name: 'ArticleListFull',
  components: {},
  props: ['articles'],
  methods: {
    getAuthor,
    getBrief,
    getHref,
    getImage,
    getValue,
    dayjs,
  },
}
</script>
<style lang="stylus" scoped>

.articleListFull
  padding 35px 0

  &-post-container
    padding 0 32px
    > h2
      position relative
      left 15px
      margin 0 0 20px
      font-size 22px
      font-weight 300
      color #000
    > h2:before
      content ""
      position absolute
      top 2px
      left -15px
      display inline-block
      width 5px
      height 20px
      background-color #000
  &-posts
    display flex
    flex-direction column
    > div
      padding 0
    > div:last-child
      margin 0

  &-post
    display flex
    flex-direction column
    margin 0 0 30px
    &__img
      position relative
      left -32px
      width calc(100% + 64px)
      figure
        width 100%
        padding-top 66.66%
        margin 0
        background-position 50% 50%
        background-repeat no-repeat
        background-size cover
    &__content
      h2
        margin 13px 0 0
        font-size 26px
        line-height 35px
        color #222
      p
        margin 0
        font-size 17px
        line-height 25px
        color #444
        text-align justify
    &__meta
      margin 10px 0
      &--author
        font-size 13px
        color #222
      &--date
        font-size 13px
        color #999
    &__brief
      display none

@media (min-width: 1200px)
  .articleListFull
    &-post-container
      > h2
        margin-left 25px
    &-posts
      flex-direction row
      flex-wrap wrap
      > div:last-child
        margin 0 25px 30px
    &-post
      width calc( (100% - 150px) / 3 )
      margin 0 25px 30px
      &__img
        position relative
        width 100%
        padding-top 66.66%
        left auto
        figure
          position absolute
          top 0
          left 0
          width 100%
          height 100%
          margin 0
          padding 0
      &__brief
        display block
</style>
