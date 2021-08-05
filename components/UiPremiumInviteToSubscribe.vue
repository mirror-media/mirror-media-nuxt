<template>
  <div class="invite-to-subscribe">
    <h1>加入鏡週刊Premium會員，閱讀完整文章</h1>
    <div class="invite-to-subscribe__plans plans">
      <div class="plans__plan">
        <div class="plans__plan plan plan--highlight-border">
          <div>
            <p>每月$99元，暢享零廣告閱讀體驗、優質報導吃到飽</p>
            <UiMembershipButtonPrimary
              class="plan__button"
              @click.native="sendMembershipSubscribe('加入Premium會員')"
            >
              加入Premium會員
            </UiMembershipButtonPrimary>
          </div>
        </div>
      </div>
      <div class="plans__plan plan">
        <div>
          <p>或以$1元立即解鎖本篇報導，享14天內無限次觀看</p>
          <UiMembershipButtonLight
            class="plan__button"
            @click.native="sendMembershipSubscribe('解鎖這篇報導')"
          >
            解鎖單篇報導
          </UiMembershipButtonLight>
        </div>
      </div>
    </div>
    <UiPremiumLoginNow
      v-if="stateMembershipSubscribe.matches('會員訂閱功能.會員文章頁.未登入')"
      class="invite-to-subscribe__login-now"
    />
  </div>
</template>

<script>
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiMembershipButtonLight from '~/components/UiMembershipButtonLight.vue'
import UiPremiumLoginNow from '~/components/UiPremiumLoginNow.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  components: {
    UiMembershipButtonPrimary,
    UiMembershipButtonLight,
    UiPremiumLoginNow,
  },

  setup() {
    const { state, send } = useMemberSubscribeMachine()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
    }
  },
}
</script>

<style lang="scss" scoped>
.invite-to-subscribe {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 12px;
  background: #ffffff;
  border: 1px solid rgba(155, 155, 155, 0.2);
  box-shadow: 0px 0px 20px -4px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  @include media-breakpoint-up(xl) {
    padding: 32px;
  }

  &__plans {
    margin: 24px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 28px 0 0 0;
    }
  }
  &__login-now {
    margin: 16px 0 0 0;
    @include media-breakpoint-up(xl) {
      margin: 28px 0 0 0;
    }
  }
}

h1 {
  font-weight: 500;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  color: #054f77;
}

.plans {
  @include media-breakpoint-up(xl) {
    display: flex;
  }

  &__plan {
    & + & {
      margin: 8px 0 0 0;
      @include media-breakpoint-up(xl) {
        margin: 0 0 0 16px;
      }
    }
  }
}

@keyframes rainbow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 25%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.plan {
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 16px;
  &--highlight-border {
    border: none;
    background-image: repeating-linear-gradient(
      to left,
      #054f77,
      #1a8fa5,
      #1d9fb8,
      #a4d8e2,
      #d1ebf0
    );
    background-size: 800% 800%;
    animation: rainbow 8s ease infinite;
    padding: 3px;
    border-radius: 4px;
    > div {
      background-color: white;
      padding: 16px;
    }
  }
  &__button {
    margin: 12px 0 0 0;
  }
}

p {
  font-size: 18px;
  line-height: 25px;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
}
</style>
