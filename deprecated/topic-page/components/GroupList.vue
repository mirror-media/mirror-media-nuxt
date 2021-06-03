<template>
  <section class="groupList">
    <div
      v-for="tag in tags"
      :key="tag.id"
      class="groupListBlockContainer"
      :class="`tag-${tag.id}`"
      :style="[
        getPostAmountByTag(tag.id) < 3 ? { 'justify-content': 'center' } : {},
      ]"
    >
      <div class="groupListBlockContainer__title">
        <h1 v-text="tag.name" />
      </div>
      <div
        v-for="post in getPostByTag(tag.id)"
        :key="post.id"
        class="groupListBlock"
      >
        <figure class="groupListBlock__img">
          <a
            :href="getHref(post)"
            target="_blank"
            :style="{
              backgroundImage: 'url(' + getImage(post, 'mobile') + ')',
            }"
          />
        </figure>
        <div class="groupListBlock__content">
          <h2>
            <a
              :href="getHref(post)"
              target="_blank"
              v-text="
                viewport < 600 ? getTruncatedVal(post.title, 19) : post.title
              "
            />
          </h2>
          <p>
            <a
              :href="getHref(post)"
              target="_blank"
              v-text="getBrief(post, 45)"
            />
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import _ from 'lodash'
import sanitizeHtml from 'sanitize-html'
import { getHref, getImage, getTruncatedVal } from '../util/comm'

export default {
  name: 'GroupList',
  props: {
    articles: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      default: () => [],
    },
    viewport: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    getBrief(article, count) {
      const brief = sanitizeHtml(
        _.get(article, ['brief', 'html'], _.get(article, ['brief'])),
        { allowedTags: [''] }
      )
      return this.getTruncatedVal(brief, count)
    },
    getHref,
    getImage,
    getPostAmountByTag(tagId) {
      const posts = _.filter(this.articles, (a) => {
        return _.find(_.get(a, ['tags']), { id: tagId })
      })
      return _.get(posts, 'length', 0)
    },
    getPostByTag(tagId) {
      return _.filter(this.articles, (a) => {
        return _.find(_.get(a, ['tags']), { id: tagId })
      })
    },
    getTruncatedVal,
  },
}
</script>
<style lang="stylus" scoped>

.groupList
  display flex
  flex-direction column
  padding 1em 0

.groupListBlockContainer
  width 90%
  margin 0 auto
  padding 1.5em 0
  text-align center
  h1
    display inline
    position relative
    left 25px
    margin 0
    font-size 1.7rem
    font-weight 400
    &:before
      content ''
      position absolute
      top 0
      left -50px
      transform skew(-20deg)
      width 30px
      height 100%
      background-color rgba(135,156,169,0.15)
    &:after
      content ''
      position absolute
      top 0
      left -40px
      transform skew(-20deg)
      width 10px
      height 100%
      background-color #999
  > div:nth-of-type(2)
    margin-top 20px
  > div:last-of-type
    border-bottom none

.groupListBlock
  display flex
  justify-content space-between
  padding 1em 0
  border-bottom 1px solid #34495e
  &__img
    width calc(45% - 10px)
    margin 0
    border-radius 2px
    overflow hidden
    > a
      display block
      padding-top 66.66%
      background-position 50% 50%
      background-repeat no-repeat
      background-size cover

  &__content
    display flex
    flex-direction column
    width calc(55% - 10px)
    h2
      margin 0
      font-size 1rem
      text-align left
      line-height 1.5
      letter-spacing 1px
    p
      display none
      margin 0
      a
        color #999

@media (min-width: 600px)
  .groupListBlockContainer
    display flex
    flex-wrap wrap
    padding 1.5em 0
    h1
      font-size 1.9rem
    > div:last-of-type
      border-bottom 1px solid #34495e
    > div:nth-of-type(2)
      margin-top 1.8em
    &__title
      width 100%
  .groupListBlock
    flex-direction column
    justify-content flex-start
    width calc(50% - 30px)
    margin 1.8em 15px 0
    padding 0 0 1.5em
    &__img
      width 100%
    &__content
      width 100%
      margin-top 1.5em
      h2
        font-size 21px
        line-height 1.3
      p
        display block
        margin-top 1em
        text-align justify
        line-height 1.5
@media (min-width: 900px)
  .groupListBlockContainer
    padding 3em 0 1.5em
    h1
      font-size 2.8rem
      &:before
        left -80px
        transform skew(-20deg)
        width 60px
      &:after
        left -60px
        width 20px
    > div:nth-of-type(2)
      margin-top 2.2em

    &__title
      margin-bottom 1em

  .groupListBlock
    width calc(33.33% - 30px)
    margin-top 2.2em
    &__content
      h2
        font-size 23px
</style>
