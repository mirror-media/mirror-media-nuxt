<template>
  <div class="plan-card">
    <img v-if="isPremium" class="plan-card__bedge" src="../assets/bedge.svg" />
    <div class="plan-card__info">
      <h6 class="plan-card__info_title">{{ title }}</h6>

      <ul class="plan-card__info_details">
        <li v-for="detail in details" :key="detail.text">
          <img src="~/assets/list-style-ckeck.svg" />
          <span :class="{ hightlight: detail.isHightlight }">
            {{ detail.text }}
          </span>
        </li>
      </ul>
    </div>

    <div class="plan-card__button_group">
      <template v-if="isPremium">
        <UiSubscribeButton
          :title="buttons[0].title"
          :hint="buttons[0].hint"
          @click.native="changePlanHandler(buttons[0])"
        />
        <UiSubscribeButton
          v-if="buttons[1]"
          :title="buttons[1].title"
          :hint="buttons[1].hint"
          color="light"
          @click.native="changePlanHandler(buttons[1])"
        />
        <div
          v-if="hintUnderButton"
          class="plan-card__button_group_hint_under_button"
        >
          {{ hintUnderButton }}
        </div>
      </template>
      <template v-else>
        <UiMembershipButtonSecondary @click.native="$emit('login')">
          加入會員
        </UiMembershipButtonSecondary>
      </template>
    </div>
  </div>
</template>

<script>
import UiSubscribeButton from '~/components/UiSubscribeButton.vue'
import UiMembershipButtonSecondary from '~/components/UiMembershipButtonSecondary.vue'
export default {
  components: {
    UiSubscribeButton,
    UiMembershipButtonSecondary,
  },
  props: {
    title: {
      type: String,
      isRequired: true,
      default: '',
    },
    details: {
      type: Array,
      isRequired: true,
      default: () => [],
    },
    buttons: {
      type: Array,
      isRequired: true,
      default: () => [],
    },
    hintUnderButton: {
      type: String,
      isRequired: true,
      default: null,
    },
  },
  computed: {
    isPremium() {
      return this.title === 'Premium 會員' || this.title === '變更為年訂閱方案'
    },
  },
  methods: {
    changePlanHandler(plan) {
      this.$emit('subscribePlan', plan)
    },
  },
}
</script>

<style lang="scss" scoped>
.plan-card {
  width: 100%;
  max-width: 463px;
  box-shadow: 0px 1px 8px rgba(0, 0, 0, 0.06), 0px 4px 12px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
  padding: 24px 20px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  @include media-breakpoint-up(sm) {
    padding: 32px 32px 24px;
  }

  &__bedge {
    position: absolute;
    top: 0;
    right: 24px;
  }

  &__info {
    &_title {
      font-weight: 500;
      font-size: 24px;
      line-height: 34px;
      color: rgba(0, 0, 0, 0.87);
      @include media-breakpoint-up(sm) {
        font-size: 26px;
        line-height: 36px;
      }
    }

    &_details {
      margin: 24px 0;
      font-size: 18px;
      line-height: 150%;
      color: rgba(0, 0, 0, 0.87);
      @include media-breakpoint-up(sm) {
        margin: 32px 0;
      }
      li {
        display: flex;
        img {
          margin-right: 5px;
        }
        & + li {
          padding-top: 12px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        &:not(:last-child) {
          padding-bottom: 12px;
        }
      }

      .hightlight {
        color: #054f77;
      }
    }
  }

  &__button_group {
    display: flex;
    flex-direction: column;

    .subcribe-button {
      max-width: 100%;
      height: 71px;
      padding: 12px;
      &:nth-child(2) {
        margin-top: 12px;
      }
    }

    &_hint_under_button {
      font-size: 13px;
      line-height: 18px;
      text-align: center;
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
