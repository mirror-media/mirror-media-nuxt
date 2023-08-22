<template>
  <section class="section">
    <ContainerList
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :gptAdPageKey="sectionIdForAd"
      :listTitle="sectionTitle"
      :listTitleColor="sectionColor"
      :shouldMountMicroAds="!isSectionMember"
    />

    <UiStickyAd :pageKey="sectionIdForAd" />
    <ContainerFullScreenAds v-if="!isSectionMember" />
  </section>
</template>

<script>
import { mapState } from 'vuex'

import ContainerList from '~/components/ContainerList.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '~/constants'
import { getSectionColor } from '~/utils/index.js'

export default {
  name: 'Section',
  components: {
    ContainerList,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  computed: {
    ...mapState({
      sections: (state) => state.sections.data.items ?? [],
    }),
    sectionName() {
      return this.$route.params.name
    },
    sectionData() {
      return (
        this.sections.find((section) => section.name === this.sectionName) ?? {}
      )
    },
    sectionId() {
      return this.sectionData.id
    },

    // if section name is "mirrorcolumn", should render ad which belongs to "culture" section
    sectionIdForAd() {
      if (this.sectionName === 'mirrorcolumn') {
        return '5964418a4bbe120f002a3198'
      }
      if (this.sectionName === 'other') {
        return 'other'
      }
      return this.sectionId
    },
    sectionTitle() {
      return this.sectionData.title
    },
    sectionColor() {
      return getSectionColor(this.sectionName)
    },
    isSectionMember() {
      return this.sectionName === 'member'
    },
  },

  methods: {
    async fetchList(page) {
      return await this.$fetchList({
        maxResults: 9,
        sort: '-publishedDate',
        sections: [this.sectionId],
        page,
      })
    },
    transformListItemContent() {
      return {
        imgText: this.sectionTitle,
        imgTextBackgroundColor: this.sectionColor,
      }
    },
  },

  head() {
    const title = `${this.sectionTitle} - ${SITE_TITLE}`
    const description = this.sectionData.description || SITE_DESCRIPTION

    return {
      title,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/section/${this.sectionName}`,
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
