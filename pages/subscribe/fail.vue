<template>
  <section>
    <h1>購買失敗</h1>
    <button @click="sendMembershipSubscribe('回前頁')">回前頁</button>
  </section>
</template>

<script>
import { useMemberSubscribeMachine } from '~/xstate/member-subscribe/compositions'

export default {
  setup() {
    const { state, send } = useMemberSubscribeMachine()
    return {
      stateMembershipSubscribe: state,
      sendMembershipSubscribe: send,
    }
  },
}
</script>
