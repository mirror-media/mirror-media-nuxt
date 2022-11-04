<template>
  <div v-if="items.length > 0" class="subtitle-navigator__wrapper">
    <ul>
      <li
        v-for="(item, index) in items"
        :key="item.id"
        :class="{
          active: currentIndex === index + 1,
          'type-two': item.type === 'header-two',
        }"
      >
        <!-- eslint-disable vue/no-v-html -->
        <a
          :href="`#header-${item.id}`"
          @click="handleIndexClick(item.id)"
          v-html="item.content"
        />
        <!-- eslint-enable vue/no-v-html -->
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'UiSubtitleNavigator',
  props: {
    items: {
      type: Array,
      required: true,
    },
    currentIndex: {
      type: Number,
      default: 0,
      required: true,
    },
  },

  methods: {
    handleIndexClick(id) {
      this.$emit('closeIndex')
      this.$scrollTo(`#header-${id}`, 500, {
        lazy: false,
        offset: -64,
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.subtitle-navigator__wrapper {
  + * {
    margin-top: 48px;
  }

  ul {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin: 0;
    padding: 0;
    li {
      color: rgba(0, 0, 0, 0.87);
      display: inline;
      font-family: 'PingFang TC';
      font-size: 16px;
      line-height: 1.5;
      font-weight: 400;
      cursor: pointer;

      &.type-two {
        color: rgba(158, 158, 158, 0.87);
      }

      &.active a {
        font-weight: 500;
        color: #054f77;
        border-bottom: 2px solid #054f77;
      }

      + li {
        margin-top: 23px;
      }
    }
  }
}
</style>
