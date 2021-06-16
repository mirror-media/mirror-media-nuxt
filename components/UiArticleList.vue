<template>
  <section class="list-wrapper">
    <h1
      v-if="showTitle"
      class="title"
      :style="{
        color: listTitleColor,
      }"
      v-text="listTitle"
    />
    <ol v-if="showList" class="list-wrapper__list list">
      <template v-for="(item, index) in listItems">
        <li :key="item.id" class="list__list-item">
          <UiArticleCard
            :href="isSlugZhouZhiFei(item.href)"
            :imgSrc="item.imgSrc"
            :imgText="item.imgText"
            :imgTextBackgroundColor="item.imgTextBackgroundColor"
            :infoTitle="item.infoTitle"
            :infoDescription="item.infoDescription"
          />
        </li>
        <li
          v-if="
            isSlotForMicroAd(getMicroAdSlotNameAfter(index)) &&
            needInsertMicroAdAfter(index)
          "
          :key="`microAd${index}`"
          class="list__list-item list__list-item--ad"
        >
          <slot :name="getMicroAdSlotNameAfter(index)" />
        </li>
      </template>
    </ol>
  </section>
</template>

<script>
import UiArticleCard from './UiArticleCard.vue'
import { MICRO_AD_UNITS } from '~/constants/ads.js'

const microAdUnits = MICRO_AD_UNITS.LISTING.RWD

export default {
  components: {
    UiArticleCard,
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
    listItems: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      indexToMicroAdName: {
        1: microAdUnits[0].name,
        2: microAdUnits[1].name,
        5: microAdUnits[2].name,
      },
    }
  },
  computed: {
    showTitle() {
      return this.listTitle !== ''
    },
    showList() {
      return this.listItems.length > 0
    },
  },
  methods: {
    needInsertMicroAdAfter(index) {
      return index === 1 || index === 2 || index === 5
    },
    getMicroAdSlotNameAfter(index) {
      return this.indexToMicroAdName[index]
    },
    isSlugZhouZhiFei(href) {
      if (href === '/story/zhou_zhi_fei') {
        return 'projects/zhou_zhi_fei'
      }
      return href
    },
    isSlotForMicroAd(unit) {
      return Object.keys(this.$slots).includes(unit)
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  padding: 0 32px;
  font-size: 24px;
  font-weight: 400;
  @include media-breakpoint-up(md) {
    padding: 0 16px;
  }
  @include media-breakpoint-up(xl) {
    padding: 0;
  }
}

.list-wrapper {
  &__list {
    margin: 20px 0 0 0;
  }
}

.list {
  display: flex;
  flex-wrap: wrap;
  &__list-item {
    width: 100%;
    & + & {
      margin: 40px 0 0 0;
    }
  }
  @include media-breakpoint-up(md) {
    margin: -20px 0 0 -20px;
    &__list-item {
      width: calc(50% - 20px);
      margin: 40px 0 0 20px;
      & + & {
        margin: 40px 0 0 20px;
      }
    }
  }
  @include media-breakpoint-up(xl) {
    &__list-item {
      width: calc(33.33% - 20px);
    }
  }
}
</style>
