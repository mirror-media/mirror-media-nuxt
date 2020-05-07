<template>
  <section class="list-wrapper">
    <h1
      v-if="listTitle !== ''"
      class="title"
      :style="{
        color: listTitleColor,
      }"
      v-text="listTitle"
    />
    <ol v-if="listData.length > 0" class="list-wrapper__list list">
      <li v-for="(item, i) in listData" :key="i" class="list__list-item">
        <UIArticleCard
          :href="item.href"
          :img-src="item.imgSrc"
          :img-text="item.imgText"
          :img-text-background-color="item.imgTextBackgroundColor"
          :info-title="item.infoTitle"
          :info-description="item.infoDescription"
        />
      </li>
    </ol>
  </section>
</template>

<script>
import UIArticleCard from './UIArticleCard.vue'
export default {
  components: {
    UIArticleCard,
  },
  props: {
    listTitle: {
      type: String,
      default: '',
    },
    listTitleColor: {
      type: String,
      default: 'black',
    },
    listData: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style lang="sass" scoped>
.title
  padding: 0 32px
  font-size: 24px
  font-weight: 400
  @include media-breakpoint-up(md)
    padding: 0 16px
  @include media-breakpoint-up(xl)
    padding: 0

.list-wrapper
  &__list
    margin: 20px 0 0 0

.list
  display: flex
  flex-wrap: wrap
  &__list-item
    width: 100%
    & + &
      margin: 40px 0 0 0
  @include media-breakpoint-up(md)
    margin: -20px 0 0 -20px
    &__list-item
      width: calc(50% - 20px)
      margin: 40px 0 0 20px
      & + &
        margin: 40px 0 0 20px
  @include media-breakpoint-up(xl)
    &__list-item
      width: calc(33.33% - 20px)
</style>
