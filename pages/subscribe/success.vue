<template>
  <section>
    <h1>購買成功</h1>
    <button @click="sendMembershipSubscribe('點擊導引連結')">回文章頁</button>
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
