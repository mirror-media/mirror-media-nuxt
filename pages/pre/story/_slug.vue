<template>
  <section>
    <UiLanding
      :sectionLabel="post.sectionLabelFirst"
      :sectionLabelColor="post.sectionLabelFirstColor"
      :title="post.title"
      :titleStyle="{
        fontFamily: 'sans-serif',
        fontWeight: 'normal',
      }"
      :coverVideo="post.coverVideo"
      :coverPicture="post.coverPicture"
      :heroCaption="post.heroCaption"
    />
    <UiArticleInfo
      class="article-info"
      :publishTime="post.publishedDate"
      :updateTime="post.updatedAt"
      :writers="post.writers"
      :extendByline="post.extendByline"
      :photographers="post.photographers"
      :tags="post.tags"
      @shareLinksVisibilityChanged="handleShareLinksVisibilityChanged"
    />
    <div class="article-body-wrapper">
      <UiArticleBody
        ref="articleBody"
        class="culture-post__article-body"
        :postId="post.id"
        :brief="post.brief"
        :briefColor="post.sectionLabelFirstColor"
        :content="post.content"
        :isArticleContentTruncatedByGateway="post.isTruncated"
        :pageState="articleBodyPageState"
        :isLoading="isLoading"
        :isFail="isFail"
        :failTimes="failTimes"
        @reload="handleReload"
      />
      <!--      <transition name="fade">-->
      <!--        <UiShareLinksHasCopyLink-->
      <!--          v-show="!isShareLinksInArticleInfoVisible"-->
      <!--          class="article-body-wrapper__share-links"-->
      <!--          :direction="'vertical-reverse'"-->
      <!--        />-->
      <!--      </transition>-->
    </div>
    <UiAnniversary />
    <UiSocialNetworkServices />
  </section>
</template>

<script>
import UiLanding from '~/components/UiLanding.vue'
import UiArticleInfo from '~/components/culture-post-for-premium/UiArticleInfo.vue'
import UiArticleBody from '~/components/culture-post-for-premium/UiArticleBody.vue'
import UiAnniversary from '~/components/UiAnniversary.vue'
import UiSocialNetworkServices from '~/components/UiSocialNetworkServices.vue'
import { PREVIEW_QUERY } from '~/configs/config'
import { getSectionColor } from '~/utils/index.js'

export default {
  // middleware: ['handle-story-premium-redirect'],
  components: {
    UiLanding,
    UiArticleInfo,
    UiArticleBody,
    UiAnniversary,
    UiSocialNetworkServices,
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

<style lang="scss" scoped>
.article-info {
  margin: 36px 20px 0 20px;
  @include media-breakpoint-up(md) {
    max-width: 608px;
    margin: 52px auto 0 auto;
  }
  @include media-breakpoint-up(xl) {
    max-width: 960px;
    margin: 64px auto 0 auto;
  }
}

.culture-post {
  color: rgba(#000, 0.87);
  word-break: break-word;
  overflow-wrap: break-word;

  &__article-body {
    padding: 0 20px;
    @include media-breakpoint-up(md) {
      padding: 0;
      margin: 0 auto;
      max-width: 608px;
    }
    @include media-breakpoint-up(xl) {
      max-width: 960px;
    }
  }
}
</style>
