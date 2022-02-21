<template>
  <section>
    <UiLanding
      :sectionLabel="post.sectionLabelFirst"
      :sectionLabelColor="post.sectionLabelFirstColor"
      :title="post.title"
      :coverVideo="post.coverVideo"
      :coverPicture="post.coverPicture"
      :heroCaption="post.heroCaption"
    />
  </section>
</template>

<script>
import UiLanding from '~/components/UiLanding.vue'
import { PREVIEW_QUERY } from '~/configs/config'
import { getSectionColor } from '~/utils/index.js'

export default {
  // middleware: ['handle-story-premium-redirect'],
  components: {
    UiLanding,
  },
  async fetch() {
    const processPostResponse = (response) => {
      if (response.status === 'fulfilled') {
        this.story = response.value?.items?.[0] ?? {}
        this.$store.commit(
          'setCanAdvertise',
          !this.story.hiddenAdvertised ?? true
        )

        const isTitleExist = this.story.title
        const isContentExist = (this.story?.content?.apiData ?? []).length > 0
        if (!isTitleExist || !isContentExist) {
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
            this.$nuxt.context.res.setHeader(
              'Cache-Control',
              'public, max-age=10'
            )
          }
          this.$nuxt.error({ statusCode: 404 })
        }

        return true
      } else {
        const { statusCode, message } = response.reason

        if (process.server) {
          this.$nuxt.context.res.statusCode = statusCode
          this.$nuxt.context.res.setHeader(
            'Cache-Control',
            'public, max-age=10'
          )
        }
        throw new Error(message)
      }
    }

    let isPreviewMode = false
    {
      const [name, value] = PREVIEW_QUERY.split('=')

      isPreviewMode = this.$route.query[name] === value
    }

    const fetchPartnersAndTopicsData = async () => {
      await Promise.all([
        this.$store.dispatch('partners/fetchPartnersData'),
        this.$store.dispatch('topics/fetchTopicsData'),
      ])
    }

    if (!this.storySlug) {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404
        this.$nuxt.context.res.setHeader('Cache-Control', 'public, max-age=10')
      }
      this.$nuxt.error({ statusCode: 404 })
    } else if (!isPreviewMode) {
      const [postResponse] = await Promise.allSettled([
        this.$fetchStoryFromMembershipGateway({
          slug: this.storySlug,
          isAudioSiteOnly: false,
          clean: 'content',
          related: 'article',
        }),
        fetchPartnersAndTopicsData(),
      ])
      const canContinueProcessing = processPostResponse(postResponse)

      if (canContinueProcessing) {
        this.membershipTokenState = postResponse?.value?.tokenState
      }
    } else {
      const [postResponse] = await Promise.allSettled([
        this.$fetchDrafts({
          slug: this.storySlug,
          isAudioSiteOnly: false,
          clean: 'content',
          related: 'article',
        }),
        fetchPartnersAndTopicsData(),
      ])

      processPostResponse(postResponse)
    }
  },
  data() {
    return {
      story: {},
      membershipTokenState: undefined,
    }
  },
  computed: {
    storySlug() {
      return this.$route.params.slug
    },
    post() {
      const {
        id = '',
        title = '',
        brief = {},
        writers = [],
        extendByline = '',
        photographers = [],
        content = {},
        heroVideo = {},
        heroImage = {},
        heroCaption = '',
        mobileImage = {},
        publishedDate = '',
        updatedAt = '',
        relateds = [],
        sections = [],
        tags = [],
        isTruncated = true,
      } = this.story

      const heroVideoSrc = heroVideo.video?.url || ''
      const heroVideoPoster =
        heroVideo.coverPhoto?.image?.resizedTargets?.mobile?.url || false
      const heroImgsResized = heroImage.image?.resizedTargets || {}

      return {
        id,
        title,
        writers,
        extendByline,
        photographers,
        brief: getBrief(),
        content: content.apiData || [],
        heroImage: heroImgsResized,
        heroCaption,
        coverVideo: {
          src: heroVideoSrc,
          poster: heroVideoPoster,
        },
        coverPicture: {
          heroImage: heroImgsResized,
          mobileImage: mobileImage?.image?.resizedTargets || {},
        },
        publishedDate: new Date(publishedDate),
        updatedAt: new Date(updatedAt),
        relateds,
        sectionLabelFirst: sections?.[0]?.title,
        sectionLabelFirstColor: getSectionColor(sections?.[0]?.name),
        tags,
        isTruncated,
      }

      function getBrief() {
        return (
          brief.apiData
            ?.filter(
              (item = {}) => item.type === 'unstyled' && item.content?.[0]
            )
            .map((item) => ({
              id: item.id,
              type: item.type,
              content: item.content,
            })) || []
        )
      }
    },
  },
}
</script>
