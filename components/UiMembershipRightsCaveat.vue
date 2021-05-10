<template>
  <div class="rights-caveat">
    <p>
      <span>繼續使用代表您同意與接受</span>
      <span>
        鏡傳媒的
        <UiMembershipLink href="https://www.mirrormedia.mg/story/service-rule">
          《服務條款》
        </UiMembershipLink>
        以及
        <UiMembershipLink href="https://www.mirrormedia.mg/story/privacy/">
          《隱私政策》
        </UiMembershipLink>
      </span>
    </p>
  </div>
</template>

<script>
import UiMembershipLink from './UiMembershipLink.vue'

export default {
  components: {
    UiMembershipLink,
  },
}
</script>

<style lang="scss" scoped>
.rights-caveat {
  font-size: 15px;
  line-height: 21px;
  text-align: center;
  color: rgba(0, 0, 0, 0.66);
}
</style>
