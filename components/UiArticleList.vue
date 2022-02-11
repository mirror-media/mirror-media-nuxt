<template>
  <section class="list-wrapper">
    <h1
      v-if="showTitle"
      class="title"
      :class="{
        title__premium: isPremiumMember,
        title__premium__tag: isPremiumMember && isTagPage,
      }"
      :style="{ color: listTitleColor }"
    >
      {{ listTitle }}
    </h1>
    <ol v-if="showList" class="list-wrapper__list list">
      <template v-for="(item, index) in listItems">
        <li :key="item.id" class="list__list-item">
          <UiArticleCard
            :href="item.href"
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
    isTagPage: {
      type: Boolean,
      default: false,
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
    isPremiumMember() {
      return this.$store?.getters?.['membership-subscribe/isPremiumMember']
    },
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
    isSlotForMicroAd(unit) {
      return Object.keys(this.$slots).includes(unit)
    },
  },
}
</script>

<style lang="scss" scoped>
.title {
  margin: 0 32px;
  font-size: 24px;
  font-weight: 400;
  &__premium {
    font-size: 20.8px;
    line-height: 115%;
    font-weight: 600;
    &__tag {
      background: #c4c4c4;
      width: fit-content;
      padding: 4px 16px;
    }
  }
  @include media-breakpoint-up(md) {
    margin: 0 16px;
  }
  @include media-breakpoint-up(xl) {
    margin: 0;
    &__premium {
      margin-top: 40px;
      &__tag {
        margin-top: 28px;
      }
    }
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
