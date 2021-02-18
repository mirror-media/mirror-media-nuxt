<template>
  <section class="externals">
    <ContainerTwoLists
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :gptAdPageKey="sectionName"
      :listTitle="partnerTitle"
      :listTitleColor="sectionColor"
    />

    <UiStickyAd :pageKey="sectionName" />
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import ContainerTwoLists from '~/components/list/ContainerTwoLists.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { SITE_TITLE, SITE_URL } from '~/constants'
import { getSectionColor } from '~/utils/index.js'

export default {
  name: 'Externals',
  components: {
    ContainerTwoLists,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  data() {
    return {
      sectionName: 'other',
      sectionColor: getSectionColor('external'),
    }
  },
  computed: {
    ...mapGetters({
      partners: 'partners/displayedPartners',
    }),
    partnerName() {
      return this.$route.params.name
    },
    partnerData() {
      return (
        this.partners.find((partner) => {
          return partner.name === this.partnerName
        }) || {}
      )
    },
    partnerId() {
      return this.partnerData.id ?? ''
    },
    partnerTitle() {
      return this.partnerData.display ?? ''
    },
  },
  methods: {
    async fetchList(page) {
      return await this.$fetchExternals({
        maxResults: 9,
        sort: '-publishedDate',
        partner: this.partnerId,
        page,
      })
    },
    transformListItemContent(item) {
      return {
        href: `/external/${item.name}`,
        imgSrc: item.thumb,
        imgText: '合作媒體',
        imgTextBackgroundColor: '#fd9b18',
      }
    },
  },
  head() {
    const title = `${this.partnerTitle} - ${SITE_TITLE}`

    return {
      title,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/externals/${this.partnerName}`,
        },
        {
          hid: 'section-name',
          name: 'section-name',
          content: this.sectionName,
        },
      ],
    }
  },
}
</script>
