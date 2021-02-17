<template>
  <section class="section">
    <ContainerTwoLists
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :gptAdPageKey="currentSectionId"
      :listTitle="currentSectionTitle"
      :listTitleColor="currentSectionThemeColor"
      :shouldMountMicroAds="!isSectionMember"
    />

    <UiStickyAd :pageKey="currentSectionId" />
    <ContainerFullScreenAds v-if="!isSectionMember" />
  </section>
</template>

<script>
import { mapState } from 'vuex'

import ContainerTwoLists from '~/components/list/ContainerTwoLists.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import styleVariables from '~/scss/_variables.scss'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '~/constants'

export default {
  name: 'Section',
  components: {
    ContainerTwoLists,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  computed: {
    ...mapState({
      sections: (state) => state.sections.data.items ?? [],
    }),
    currentSectionName() {
      return this.$route.params.name
    },
    currentSectionData() {
      return (
        this.sections.find(
          (section) => section.name === this.currentSectionName
        ) ?? {}
      )
    },
    currentSectionId() {
      return this.currentSectionData.id
    },
    currentSectionTitle() {
      return this.currentSectionData.title
    },
    currentSectionThemeColor() {
      const key = `section-color-${this.currentSectionName}`
      return styleVariables[key]
    },
    isSectionMember() {
      return this.currentSectionName === 'member'
    },
  },

  methods: {
    async fetchList(page) {
      return await this.$fetchList({
        maxResults: 9,
        sort: '-publishedDate',
        sections: [this.currentSectionId],
        page,
      })
    },
    transformListItemContent() {
      return {
        imgText: this.currentSectionTitle,
        imgTextBackgroundColor: this.currentSectionThemeColor,
      }
    },
  },

  head() {
    const title = `${this.currentSectionTitle} - ${SITE_TITLE}`
    const description = this.currentSectionData?.description || SITE_DESCRIPTION

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
          content: `${SITE_URL}/section/${this.$route.params.name}`,
        },
        {
          hid: 'section-name',
          name: 'section-name',
          content: this.currentSectionName,
        },
      ],
    }
  },
}
</script>
