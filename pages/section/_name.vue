<template>
  <section class="section">
    <ContainerTwoLists
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      :gptAdPageKey="sectionId"
      :listTitle="sectionTitle"
      :listTitleColor="sectionThemeColor"
      :shouldMountMicroAds="!isSectionMember"
    />

    <UiStickyAd :pageKey="sectionId" />
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
    sectionTitle() {
      return this.sectionData.title
    },
    sectionThemeColor() {
      const key = `section-color-${this.sectionName}`
      return styleVariables[key]
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
        imgTextBackgroundColor: this.sectionThemeColor,
      }
    },
  },

  head() {
    const title = `${this.sectionTitle} - ${SITE_TITLE}`
    const description = this.sectionData?.description || SITE_DESCRIPTION

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
