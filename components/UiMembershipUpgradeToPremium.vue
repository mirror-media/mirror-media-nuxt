<template>
  <div>
    <div class="purchase__message">{{ messageTitle }}</div>
    <div class="purchase__upgrade">
      <div class="purchase__upgrade_title">
        準備好升級為鏡週刊 Premium 會員了嗎？
      </div>
      <div class="purchase__upgrade_content">
        限時優惠每月$49元，優質報導零廣告看到飽
      </div>
      <UiMembershipButtonPrimary @click.native="$emit('upgrade')">
        升級 Premium 會員
      </UiMembershipButtonPrimary>
    </div>
  </div>
</template>

<script>
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'

export default {
  components: {
    UiMembershipButtonPrimary,
  },
  props: {
    messageTitle: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.purchase {
  &__message {
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
    color: rgba(0, 0, 0, 0.66);
    margin-bottom: 24px;
    margin-top: 16px;
  }

  &__upgrade {
    width: 100%;
    padding: 24px 16px;
    border: 1px solid rgba(155, 155, 155, 0.2);
    box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    &_title {
      font-weight: 600;
      font-size: 22px;
      line-height: 31px;
      color: #054f77;
      margin-bottom: 12px;
      @include media-breakpoint-up(sm) {
        font-size: 24px;
        line-height: 34px;
      }
    }

    &_content {
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }

    .button {
      max-width: 320px;
    }
  }
}
</style>
