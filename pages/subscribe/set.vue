<template>
  <div class="subscribe-set">
    <SubscribeWrapper>
      <h6 class="subscribe-set__title">付款設定</h6>
      <div class="subscribe-set__detail">
        <div class="subscribe-set__detail_row">
          <div>取消訂閱</div>
          <div>
            <a
              @click.prevent="
                sendMembershipSubscribe('取消訂閱鏡週刊 Premium 服務')
              "
            >
              取消訂閱鏡週刊 Premium 服務
              <img src="~/assets/arrow-next-default.svg" />
            </a>
          </div>
        </div>
        <div class="subscribe-set__detail_row cancel">
          <div>更換信用卡</div>
          <div>如您要變更信用卡，請先取消訂閱後，再重新訂閱</div>
        </div>
      </div>
    </SubscribeWrapper>
  </div>
</template>

<script>
import SubscribeWrapper from '~/components/SubscribeWrapper.vue'
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
    }
  },
  components: { SubscribeWrapper },
  methods: {
    handleBack() {
      window.location.assign('/subscribe/set')
    },
  },
}
</script>

<style lang="scss" scoped>
.subscribe-set {
  min-height: 100vw;
  padding: 40px 20px 0 20px;
  @include media-breakpoint-up(sm) {
    min-height: calc(100vw - 850px);
    padding: 80px;
  }

  &__title {
    font-size: 20px;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.87);
    margin-bottom: 16px;
  }

  &__detail {
    &_row {
      padding: 16px 0;

      div:nth-child(2) {
        font-size: 16px;
        line-height: 150%;
        margin-top: 4px;
      }

      a {
        color: #054f77;
        display: flex;
        align-items: center;
        cursor: pointer;
      }
      img {
        width: 16px;
        height: 16px;
        margin-left: 2px;
      }

      @include media-breakpoint-up(sm) {
        display: flex;
        justify-content: space-between;

        div:nth-child(2) {
          margin-top: 0;
        }

        &:nth-child(2) :nth-child(2) {
          max-width: 225px;
        }
      }

      &:not(:first-child) {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        color: rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
