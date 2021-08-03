<template>
  <div class="subscribe-cancel">
    <div class="subscribe-cancel__title" v-text="title" />
    <div class="subscribe-cancel__description" v-html="description" />
    <template v-if="isAsk" class="subscribe-cancel__ask_form">
      <label for="content">
        <input
          type="checkbox"
          id="content"
          value="文章無法滿足需求"
          v-model="reason"
        />
        文章無法滿足需求</label
      >
      <label for="other-media">
        <input
          type="checkbox"
          id="other-media"
          value="已訂閱其他媒體"
          v-model="reason"
        />
        已訂閱其他媒體</label
      >
      <label for="user-experience">
        <input
          type="checkbox"
          id="user-experience"
          value="使用體驗不佳"
          v-model="reason"
        />
        使用體驗不佳</label
      >
      <label for="change-plan">
        <input
          type="checkbox"
          id="change-plan"
          value="想改用單篇付費方式繼續閱讀"
          v-model="reason"
        />
        想改用單篇付費方式繼續閱讀</label
      >
      <label for="other">
        <input type="checkbox" id="other" value="其他" v-model="reason" />
        其他</label
      >
      <textarea
        v-if="shouldShowTextarea"
        v-model="otherDetail"
        placeholder="請輸入您的回饋..."
        rows="3"
      />
      <div class="subscribe-cancel__ask_form_button_group">
        <UiMembershipButtonSecondary @click.native="() => $emit('back')"
          >返回</UiMembershipButtonSecondary
        >
        <UiMembershipButtonPrimary>確認取消訂閱</UiMembershipButtonPrimary>
      </div>
    </template>
    <template v-else>
      <UiMembershipButtonPrimary
        class="subscribe-cancel__back"
        @click.native="() => $emit('back')"
        >回訂閱紀錄</UiMembershipButtonPrimary
      >
    </template>
  </div>
</template>

<script>
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiMembershipButtonSecondary from '~/components/UiMembershipButtonSecondary.vue'
export default {
  components: {
    UiMembershipButtonSecondary,
    UiMembershipButtonPrimary,
  },
  props: {
    isAsk: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '取消訂閱',
    },
    description: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      reason: [],
      otherDetail: '',
    }
  },
  computed: {
    shouldShowTextarea() {
      return this.reason.includes('其他')
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-cancel {
  margin: 0 auto;
  font-size: 18px;
  line-height: 150%;
  @include media-breakpoint-up(sm) {
    width: 423px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 24px 24px 16px 24px;
  }

  &__title {
    font-size: 20px;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.87);
  }

  &__description {
    margin: 4px 0 24px 0;
    color: rgba(0, 0, 0, 0.66);

    & >>> .blue {
      color: red;
    }
  }

  label {
    display: block;
    color: rgba(0, 0, 0, 0.87);

    input {
      height: 16px;
      width: 16px;
      margin-right: 8px;
    }

    &:not(:first-child) {
      margin-top: 8px;
    }
  }
  textarea {
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    width: 100%;
    height: 99px;
    padding: 12px;
    margin-top: 8px;
    resize: none;

    &::placeholder {
      color: rgba(0, 0, 0, 0.3);
    }

    &:focus {
      border: 1px solid rgba(0, 0, 0, 0.87);
      outline: none;
    }
  }

  &__ask_form_button_group {
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
    .button {
      width: 64px;
      height: 38px;
      padding: 8px 12px;
      font-size: 16px;
      line-height: 22px;
      &:nth-child(2) {
        width: 128px;
      }
    }
  }

  &__back {
    margin: 0 auto;
    width: 240px;
    height: 48px;
  }
}
</style>
