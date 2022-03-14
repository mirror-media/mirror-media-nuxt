<template>
  <div>
    <nuxt />

    <ClientOnly>
      <TheGdpr />
    </ClientOnly>
  </div>
</template>

<script>
import TheGdpr from '~/components/TheGdpr.vue'

import { fireActivationEvent } from '~/utils/google-optimize.js'

import { sendMemberPageViewToFbPixel } from '~/composition/fb-pixel.js'
export default {
  name: 'Empty',
  setup() {
    sendMemberPageViewToFbPixel()
  },
  errorCaptured(error, vm, info) {
    if (vm.$route.name === 'premium-slug') {
      this.$sendMembershipErrorLog({
        email: this.$store.state.membership.userEmail,
        token: this.$store.state.membership.userToken,
        firebaseId: this.$store.state.membership.userUid,
        memberType: this.$store.state['membership-subscribe'].basicInfo.type,
        xstate: vm.stateMembershipSubscribe,
        description: {
          errorMessage: error.message,
          errorTrace: error.stack,
          info,
        },
        eventType: 'premiumVueError',
      })
    }
  },
  components: {
    TheGdpr,
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters['membership/isLoggedIn']
    },
  },
  mounted() {
    fireActivationEvent.bind(this)()
  },
}
</script>
