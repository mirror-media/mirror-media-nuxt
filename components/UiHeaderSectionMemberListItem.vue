<template>
  <li
    :class="[
      'list-item',
      { 'list-item--separator-left': section.shouldShowSeparator },
    ]"
    @mouseover="shouldShowCategoryList = true"
    @mouseout="shouldShowCategoryList = false"
  >
    <div class="section">
      <h1
        :class="[
          'section__title',
          { 'section__title--hover': shouldShowCategoryList },
        ]"
      >
        <a
          :href="`${
            section.customPath !== null
              ? '/' + (section.customPath || 'premiumsection')
              : ''
          }/${section.name}`"
          v-text="section.title"
        />
      </h1>
      <ul
        v-if="section.categories.length > 0"
        v-show="shouldShowCategoryList"
        class="section__member-category-list member-category-list"
      >
        <li
          v-for="category in section.categories"
          :key="category.id"
          class="member-category-list__category"
        >
          <a :href="`/category/${category.name}`" v-text="category.title" />
        </li>
      </ul>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    section: {
      type: Object,
      required: true,
      validator(value) {
        return Object.prototype.hasOwnProperty.call(value, 'categories')
      },
    },
  },
  data() {
    return {
      shouldShowCategoryList: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.list-item {
  cursor: pointer;
  width: 113px;
  height: 100%;
  color: #4a4a4a;

  &--separator-left {
    box-shadow: -12px 0 0px -11px rgba(0, 0, 0, 0.1);
  }
}

.section {
  height: 100%;
  &__title {
    height: 100%;
    &--hover {
      background-color: #054f77;
      color: white;
    }
    a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.member-category-list {
  width: 145px;
  max-height: calc(100vh - 64px);
  background-color: white;
  filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2));
  overflow-y: scroll;
  &__category {
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: #054f77;
      color: white;
    }
    a {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
