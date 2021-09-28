<template>
  <section class="page">
    <ContainerMembershipCancelHoldUp v-if="pageState === 'holdUp'" />
    <ContainerMembershipCancelPleaseConfirm
      v-else-if="pageState === 'confirmation'"
      @success="handleCancelSuccess"
      @error="handleCancelError"
    />
    <ContainerMembershipCancelSuccess v-else-if="pageState === 'success'" />
    <ContainerMembershipCancelError
      v-else-if="pageState === 'error'"
      :errorResponse="errorResponse"
    />
  </section>
</template>

<script>
import { ENV } from '../configs/config.js'
import ContainerMembershipCancelHoldUp from '~/components/ContainerMembershipCancelHoldUp.vue'
import ContainerMembershipCancelPleaseConfirm from '~/components/ContainerMembershipCancelPleaseConfirm.vue'
import ContainerMembershipCancelSuccess from '~/components/ContainerMembershipCancelSuccess.vue'
import ContainerMembershipCancelError from '~/components/ContainerMembershipCancelError.vue'

const IS_SUBSCRIPTION_FUNCTION_IS_ON = ENV !== 'prod'

export default {
  components: {
    ContainerMembershipCancelHoldUp,
    ContainerMembershipCancelPleaseConfirm,
    ContainerMembershipCancelSuccess,
    ContainerMembershipCancelError,
  },
  middleware: ['authenticate'],
  async asyncData(context) {
    if (IS_SUBSCRIPTION_FUNCTION_IS_ON) return

    const memberType = await context.$getMemberType()

    const isPremiumOrVip =
      memberType === 'year' ||
      memberType === 'month' ||
      memberType === 'marketing'
    if (isPremiumOrVip) {
      return {
        pageState: 'holdUp',
      }
    }
  },
  data() {
    return {
      pageState: 'confirmation',
      errorResponse: {},
    }
  },
  methods: {
    handleCancelSuccess() {
      this.pageState = 'success'
    },
    handleCancelError(err) {
      this.errorResponse = err
      this.pageState = 'error'
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  min-height: calc(100vh - 118px);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  @include media-breakpoint-up(xl) {
    padding-top: 20px;
  }
}
</style>
