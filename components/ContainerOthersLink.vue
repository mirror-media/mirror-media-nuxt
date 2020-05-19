<template>
  <div>
    <slot :links="links" :handleSendGA="handleSendGA" />
  </div>
</template>

<script>
import { SOCIAL_LINK } from '~/constants/index'

export default {
  name: 'ContainerOthersLink',
  data() {
    return {
      links: [
        {
          textContent: '訂閱鏡週刊',
          href: SOCIAL_LINK.SUBSCRIBE,
          ga: {
            eventLabel: 'more subscribe',
          },
        },
        {
          textContent: '訂閱電子雜誌',
          href: SOCIAL_LINK.MAGAZINE,
          ga: {
            eventLabel: 'more magazine',
          },
        },
        {
          textContent: '內容授權',
          href: SOCIAL_LINK.AUTH,
          ga: {
            eventLabel: 'more auth',
          },
        },
        {
          textContent: '廣告合作',
          href: SOCIAL_LINK.AD,
          ga: {
            eventLabel: 'more ad',
          },
        },
        {
          textContent: '活動專區',
          href: SOCIAL_LINK.CAMPAIGN,
          ga: {
            eventLabel: 'more campaign',
          },
        },
        {
          textContent: '下載APP',
          href: SOCIAL_LINK.DOWNLOAD_APP,
          ga: {
            eventLabel: 'more download',
          },
        },
      ],
    }
  },
  methods: {
    handleSendGA(param = {}) {
      this.$ga.event(param)
    },
  },
}
</script>
