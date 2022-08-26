<template>
  <div v-if="items.length > 0" class="subtitle-navigator__wrapper">
    <ul>
      <li
        v-for="(item, index) in items"
        :key="item.id"
        :class="{ active: currentIndex === index + 1 }"
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
      color: #404040de;
      display: inline;
      font-family: source-han-serif-tc, 'Songti TC', serif;
      font-size: 18px;
      line-height: 1.5;
      font-weight: 700;
      cursor: pointer;

      &.active a {
        border-bottom: solid 2px #dec5a2;
      }

      + li {
        margin-top: 19px;
      }
    }
  }
}
</style>
