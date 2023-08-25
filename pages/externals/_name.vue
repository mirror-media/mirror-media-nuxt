<template>
  <section class="externals">
    <ContainerList
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :gptAdPageKey="sectionId"
      :listTitle="partnerTitle"
      :listTitleColor="sectionColor"
    />

    <UiStickyAd :pageKey="sectionId" />
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

import axios from 'axios'
import ContainerList from '~/components/ContainerList.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { SITE_TITLE, SITE_URL } from '~/constants'
import { getSectionColor } from '~/utils/index.js'

export default {
  name: 'Externals',
  components: {
    ContainerList,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  data() {
    return {
      sectionId: 'other',
      sectionColor: getSectionColor('external'),
    }
  },

  computed: {
    ...mapGetters({
      partners: 'partners/displayedPartners',
    }),
    isWarmLife() {
      return (
        this.$route.params.name === 'warmlife' &&
        this.$config.warmlifeFeatureToggle
      )
    },
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
      if (this.isWarmLife) return '生活暖流'
      return this.partnerData.display ?? ''
    },
  },
  mounted() {
    /*
     * if partnerName is healthnews, this pages should show
     * advertisements which is originally displayed at /section/news
     */
    if (this.partnerName === 'healthnews') {
      this.sectionId = '57e1e0e5ee85930e00cad4e9'
    }
  },
  methods: {
    async fetchList(page) {
      if (this.isWarmLife) {
        try {
          const { data } = await axios(
            'https://storage.googleapis.com/statics.mirrormedia.mg/json/life_feed.json'
          )
          return {
            items: data._items,
            links: data._links,
            meta: {
              ...data._meta,
              total: data._items?.length || 0,
            },
          }
        } catch (error) {
          console.log(error)
          return []
        }
      }
      return await this.$fetchExternals({
        maxResults: 9,
        sort: '-publishedDate',
        partner: this.partnerId,
        page,
      })
    },
    transformListItemContent(item) {
      let imgText
      let imgTextBackgroundColor
      if (this.partnerName === 'healthnews') {
        imgText = '生活'
        imgTextBackgroundColor = '#30bac8'
      } else if (this.partnerName === 'warmlife') {
        imgText = '生活'
        imgTextBackgroundColor = '#2ECDA7'
      } else if (this.partnerName === 'ebc') {
        imgText = '時事'
        imgTextBackgroundColor = '#30bac8'
      } else {
        // default text and background color
        imgText = '合作媒體'
        imgTextBackgroundColor = '#fd9b18'
      }
      return {
        href: `/external/${item.name}`,
        imgSrc: item.thumb,
        imgText,
        imgTextBackgroundColor,
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
          content: 'other',
        },
      ],
    }
  },
}
</script>
