<template>
  <nav class="breadcrumbs">
    <div
      v-for="crumbs in breadcrumbs"
      :key="crumbs.name"
      class="breadcrumbs__crumb crumb"
    >
      <a
        :href="crumbs.link"
        rel="noreferrer noopener"
        class="crumb__link"
        :style="{
          color: crumbs.color,
        }"
        v-text="crumbs.text"
      />
      <BreadcrumbSeparatorIcon
        class="crumb__separator"
        :style="{ color: separatorColor }"
      />
    </div>
  </nav>
</template>

<script>
import BreadcrumbSeparatorIcon from '~/assets/breadcrumb-separator-icon.svg?inline'

export default {
  components: {
    BreadcrumbSeparatorIcon,
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: () => [],
    },
    separatorColor: {
      type: String,
      default: '#9B9B9B',
    },
  },
}
</script>

<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
}

.crumb {
  display: flex;
  align-items: center;
  &:last-child:not(:first-child) {
    .crumb__separator {
      display: none;
    }
  }

  &__separator {
    margin: 0 8px;
    height: 24px;
    @include media-breakpoint-up(md) {
      height: 33px;
    }

    ::v-deep path {
      fill: currentColor !important; // same effect of inherit, but mismatch css value error-free
    }
  }
  &__link {
    font-family: source-han-serif-tc, 'Songti TC', serif;
    font-weight: 600;
    font-size: 24px;
    color: #4a4a4a;
    @include media-breakpoint-up(md) {
      font-size: 32px;
    }
  }
}
</style>
