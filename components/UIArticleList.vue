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
      <template v-for="(item, index) in listData">
        <li :key="item.id" class="list__list-item">
          <UIArticleCard
            :href="item.href"
            :imgSrc="item.imgSrc"
            :imgText="item.imgText"
            :imgTextBackgroundColor="item.imgTextBackgroundColor"
            :infoTitle="item.infoTitle"
            :infoDescription="item.infoDescription"
          />
        </li>
        <li
          v-if="needInsertMicroAdAfter(index)"
          :key="`microAd${index}`"
          class="list__list-item"
        >
          <slot :name="getMicroAdSlotNameAfter(index)" />
        </li>
      </template>
    </ol>
  </section>
</template>

<script>
import UIArticleCard from './UIArticleCard.vue'
import microAdUnits from '~/constants/microAdUnits'

const microAdUnitsKey = Object.keys(microAdUnits.LISTING)

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
      required: true,
    },
  },
  data() {
    return {
      indexToMicroAdKey: {
        1: microAdUnitsKey[0],
        2: microAdUnitsKey[1],
        5: microAdUnitsKey[2],
      },
    }
  },
  computed: {
    showTitle() {
      return this.listTitle !== ''
    },
    showList() {
      return this.listData.length > 0
    },
  },
  methods: {
    needInsertMicroAdAfter(index) {
      return index === 1 || index === 2 || index === 5
    },
    getMicroAdSlotNameAfter(index) {
      return this.indexToMicroAdKey[index]
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
