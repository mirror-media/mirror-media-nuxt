<template>
  <div class="invite-to-subscribe">
    <h1>歡迎加入鏡週刊 會員專區</h1>
    <div class="invite-to-subscribe__plans plans">
      <div class="plans__plan">
        <div class="plans__plan plan plan--highlight-border">
          <div>
            <div class="plan__description">
              <p>限時優惠每月$49元<br />全站看到飽</p>
            </div>
            <UiMembershipButtonPrimary
              class="plan__button"
              data-user-behavior-description="premium-subscribe"
              @click.native="subscribePremium"
            >
              加入Premium會員
            </UiMembershipButtonPrimary>
          </div>
        </div>
      </div>
      <div class="plans__plan plan">
        <div>
          <div class="plan__description">
            <p>$5 元可享單篇好文 14 天無限瀏覽</p>
          </div>
          <UiMembershipButtonLight
            class="plan__button"
            data-user-behavior-description="onetime-subscribe"
            @click.native="subscribePost"
          >
            解鎖單篇報導
          </UiMembershipButtonLight>
        </div>
      </div>
    </div>
    <UiPremiumLoginNow
      v-if="shouldShowLoginNow"
      class="invite-to-subscribe__login-now"
      @login="$emit('login')"
    />
  </div>
</template>

<script>
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiMembershipButtonLight from '~/components/UiMembershipButtonLight.vue'
import UiPremiumLoginNow from '~/components/UiPremiumLoginNow.vue'
import { useCustomEventToFbPixel } from '~/composition/fb-pixel.js'

export default {
  setup() {
    return { useCustomEventToFbPixel }
  },
  components: {
    UiMembershipButtonPrimary,
    UiMembershipButtonLight,
    UiPremiumLoginNow,
  },
  props: {
    shouldShowLoginNow: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    subscribePost() {
      this.useCustomEventToFbPixel('Premium-subscribe-one-time-truncated')

      this.$emit('subscribePost')
    },
    subscribePremium() {
      this.useCustomEventToFbPixel('Premium-subscribe-truncated')
      this.$emit('subscribePremium')
    },
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
    & > div {
      min-width: 234px;
    }
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
  &__description {
    min-height: 50px;
    display: flex;
    align-items: center;
    * {
      flex: 1;
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
