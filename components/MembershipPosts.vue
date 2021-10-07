<template>
  <div class="membership-post-list">
    <div class="membership-post-list__title">
      <div class="membership-post-list__title_status">訂閱中文章</div>
    </div>
    <div class="membership-post-list__form">
      <div class="membership-post-list__form_row">
        <div>文章標題</div>
        <div>閱讀期限</div>
      </div>
      <div
        v-for="post in postList"
        :key="post.id"
        class="membership-post-list__form_row"
      >
        <div>
          <!-- TODO: replace this mock href with real link if we finish data fetching -->
          <a :href="post.url">{{ post.title }}</a>
        </div>
        <div>{{ post.deadline }}</div>
      </div>
      <div
        v-if="showMorePostButton"
        class="membership-post-list__form_row load-more"
        @click="$emit('load-more-post')"
      >
        展開更多
        <img src="~/assets/arrow-down-default.svg" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    postList: {
      type: Array,
      require: true,
      default: () => [],
    },
    showMorePostButton: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.membership-post-list {
  &__title {
    &_status {
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.66);
    }
  }

  &__form {
    margin-top: 24px;
    font-size: 15px;
    line-height: 21px;
    color: rgba(0, 0, 0, 0.87);
    @include media-breakpoint-up(sm) {
      font-size: 16px;
      line-height: 150%;
    }
    &_row {
      display: flex;
      div + div {
        margin-left: 16px;
      }
      div {
        flex: 1;
        &:first-child {
          flex: 3;
        }
      }
      &:first-child {
        padding-bottom: 8px;
      }
      &:not(:first-child) {
        padding-top: 12px;
        color: rgba(0, 0, 0, 0.5);
        border-top: 1px solid rgba(0, 0, 0, 0.1);
      }
      &:nth-child(2) {
        border-top: 1px solid rgba(0, 0, 0, 0.5) !important;
      }
      &:not(last-child) {
        padding-bottom: 12px;
      }

      a {
        color: #054f77;
      }
    }
    .load-more {
      color: #054f77;
      justify-content: center;
      cursor: pointer;
      display: flex;
      width: auto;
      img {
        margin-left: 2px;
      }
    }
  }
}
</style>
