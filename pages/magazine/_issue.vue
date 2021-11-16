<template>
  <div
    :class="[
      'page-wrapper',
      { 'page-wrapper--padding-less': isMagazinesVisible },
    ]"
  >
    <ClientOnly>
      <div v-if="!isMagazinesVisible">
        <h1 class="upgrade-title">電子雜誌</h1>
        <UiMembershipUpgradeToPremium
          :messageTitle="'加入Premium會員，免費閱覽最新電子版週刊'"
          @upgrade="handleUpgrade"
        />
      </div>
      <iframe
        v-else
        :src="`https://storage.googleapis.com/statics.mirrormedia.mg/campaigns/${$route.params.issue}/index.html`"
      />
    </ClientOnly>
  </div>
</template>

<script>
import { shouldIdentifyMarketingByEmail } from '~/middleware/utils'
import UiMembershipUpgradeToPremium from '~/components/UiMembershipUpgradeToPremium.vue'

export default {
  layout: 'empty',
  components: {
    UiMembershipUpgradeToPremium,
  },
  middleware: ['authenticate'],
  computed: {
    isMagazinesVisible() {
      const memberType =
        this.$store.state['membership-subscribe'].basicInfo?.type ?? 'none'
      return (
        shouldIdentifyMarketingByEmail(this.$store) ||
        memberType === 'marketing' ||
        memberType === 'subscribe_monthly' ||
        memberType === 'subscribe_yearly'
      )
    },
  },
  methods: {
    handleUpgrade() {
      window.location.assign('/subscribe')
    },
  },
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  padding: 48px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @include media-breakpoint-up(xl) {
    padding: 24px 0 48px 0;
  }

  &--padding-less {
    padding: 0;
  }
}

.upgrade-title {
  font-size: 22px;
  line-height: 30.8px;
  color: rgba(0, 0, 0, 0.66);
  margin-bottom: 12px;
  @include media-breakpoint-up(sm) {
    font-size: 24px;
    line-height: 34px;
  }
}

iframe {
  width: 100vw;
  height: 100vh;
}
</style>
