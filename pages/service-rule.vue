<template>
  <div class="service-rule">
    <div class="service-rule__title">服務條款</div>
    <div class="service-rule__description">
      歡迎加入鏡週刊會員！繼續使用前，請先詳閱鏡週刊服務條款。
    </div>
    <div class="service-rule__content">
      <div class="service-rule__content_wrapper">
        <div v-for="paragraph in paragraphList" :key="paragraph.id">
          <UiStoryContentHandler :paragraph="filterHTML(paragraph)" />
        </div>
      </div>
      <div class="service-rule__content_agree">
        <label>
          <input type="checkbox" v-model="isChecked" :checked="isChecked" />
          <span>我同意以上條款</span>
        </label>
        <UiMembershipButtonPrimary
          :disabled="!isChecked"
          @click.native="handleSubmit"
          >繼續登入</UiMembershipButtonPrimary
        >
      </div>
    </div>
  </div>
</template>

<script>
import Cookie from 'vue-cookie'
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiStoryContentHandler from '~/components/UiStoryContentHandler.vue'

export default {
  components: {
    UiMembershipButtonPrimary,
    UiStoryContentHandler,
  },
  async fetch() {
    const processPostResponse = (response) => {
      if (response.status === 'fulfilled') {
        this.story = response.value.items?.[0] ?? {}

        const isTitleExist = this.story.title
        const isContentExist = (this.story?.content?.apiData ?? []).length > 0
        if (!isTitleExist || !isContentExist) {
          if (process.server) {
            this.$nuxt.context.res.statusCode = 404
          }
          throw new Error('not found')
        }

        return true
      } else {
        const { statusCode, message } = response.reason

        if (process.server) {
          this.$nuxt.context.res.statusCode = statusCode
        }
        throw new Error(message)
      }
    }

    const fetchPartnersAndTopicsData = async () => {
      await Promise.all([
        this.$store.dispatch('partners/fetchPartnersData'),
        this.$store.dispatch('topics/fetchTopicsData'),
      ])
    }

    const [postResponse] = await Promise.allSettled([
      this.$fetchPostsFromMembershipGateway(
        {
          slug: 'service-rule',
          isAudioSiteOnly: false,
          clean: 'content',
          related: 'article',
        },
        this.$store.state.membership.userToken
      ),
      fetchPartnersAndTopicsData(),
    ])
    const canContinueProcessing = processPostResponse(postResponse)

    if (canContinueProcessing) {
      this.membershipTokenState = postResponse.value.tokenState
    }
  },
  data() {
    return {
      story: {},
      isChecked: false,
    }
  },
  computed: {
    paragraphList() {
      return this.story.content?.apiData
    },
  },
  methods: {
    filterHTML(paragraph) {
      const content = paragraph.content[0]
      const newContent = []
      if (typeof content === 'string') {
        newContent.push(content.replace(/(<([^>]+)>)/gi, ''))
      } else {
        newContent.push(
          content.map((item) => item.replace(/(<([^>]+)>)/gi, ''))
        )
      }
      return { ...paragraph, content: newContent }
    },
    handleSubmit(e) {
      e.preventDefault()
      Cookie.set('read-service-rule', true, { expires: '30m' })
      const destination = this.$route.query.destination || '/'
      window.location.replace(`/login?destination=${destination}`)
    },
  },
}
</script>

<style lang="scss" scoped>
.service-rule {
  max-width: 680px;
  margin: 24px auto;
  padding: 20px;

  @include media-breakpoint-up(md) {
    padding: 0px;
  }

  &__title {
    font-size: 20px;
    line-height: 32px;
    color: rgba(0, 0, 0, 0.87);
  }

  &__description {
    font-size: 18px;
    line-height: 150%;
    color: rgba(0, 0, 0, 0.66);
    margin-top: 4px;
  }

  &__content {
    margin-top: 12px;
    font-size: 13px;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.87);
    @include media-breakpoint-up(md) {
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 40px;
      max-height: calc(100% - 233px);
    }

    &_wrapper {
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 21px 12px;
      height: calc(100vh - 500px);
      overflow: scroll;
      @include media-breakpoint-up(md) {
        border: 0;
        padding: 0;
        height: auto;
        overflow: inherit;
      }

      * + * {
        margin-top: 1.5rem;
      }

      h2 {
        margin-top: 0px;
      }

      ul {
        li {
          list-style-type: disc;
          margin-left: 20px;
          &::marker {
            font-size: 15px;
          }
        }
      }
    }

    &_agree {
      font-size: 18px;
      line-height: 25px;
      color: rgba(0, 0, 0, 0.87);
      margin-top: 32px;
      display: flex;
      align-items: center;
      flex-direction: column;

      label {
        display: flex;
        align-items: center;

        input[type='checkbox'] {
          width: 16px;
          height: 16px;
          margin-right: 8px;
        }
      }
    }

    .button {
      width: 240px;
      margin-top: 24px;
    }
  }
}
</style>
