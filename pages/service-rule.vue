<template>
  <div class="service-rule">
    <div class="service-rule__title">服務條款</div>
    <div class="service-rule__description">
      歡迎加入鏡週刊會員！繼續使用前，請先詳閱鏡週刊服務條款。
    </div>
    <div class="service-rule__wrapper">
      <div v-for="paragraph in paragraphList" :key="paragraph.id">
        <UiStoryContentHandler :paragraph="filterHTML(paragraph)" />
      </div>
    </div>
    <div class="service-rule__agree">
      <label>
        <input v-model="isChecked" type="checkbox" :checked="isChecked" />
        <span>我同意以上條款</span>
      </label>
      <UiMembershipButtonPrimary
        :disabled="!isChecked"
        @click.native="handleSubmit"
        >繼續</UiMembershipButtonPrimary
      >
    </div>
  </div>
</template>

<script>
import UiMembershipButtonPrimary from '~/components/UiMembershipButtonPrimary.vue'
import UiStoryContentHandler from '~/components/UiStoryContentHandler.vue'
import redirectDestination from '~/utils/redirect-destination'

// import errors from '@twreporter/errors'

const SERVICE_RULE = [
  {
    styles: {},
    content: [
      ' 精鏡傳媒股份有限公司（以下簡稱為「鏡週刊」）為透過網際網路提供會員鏡週刊雜誌電子書及鏡週刊新聞內容服務（簡稱「服務」），制定本服務條款。 ',
    ],
    alignment: 'center',
    type: 'unstyled',
    id: 'v6mc',
  },
  {
    styles: {},
    content: [' <strong>一、同意接受條款及條件</strong> '],
    alignment: 'center',
    type: 'header-two',
    id: '3gufv',
  },
  {
    styles: {},
    content: [
      '會員在加入並使用服務時，表示會員同意接受本服務條款之規範。如會員不同意遵守本服務條款之全部或一部時，請勿加入或使用。服務只會提供予接受本服務條款之會員。「鏡週刊」會不定時發送通知或公告，這些通知或公告均構成服務條款的一部分。當會員於本服務條款修改或變更後仍繼續使用時，表示會員已確實詳閱讀、瞭解並同意遵守本服務條款之修改或變更。',
    ],
    alignment: 'center',
    type: 'unstyled',
    id: 'du5s8',
  },
  {
    styles: {},
    content: [
      '若會員未具備完全行為能力，除會員本人同意遵守上述規定外，會員的法定代理人並須同時詳閱、瞭解並同意遵守本條款之所有內容，會員才能註冊並使用服務。當會員於本服務條款修改或變更後仍繼續使用時，表示會員的法定代理人亦已確實詳閱讀、瞭解並同意遵守本服務條款之修改或變更。',
    ],
    alignment: 'center',
    type: 'unstyled',
    id: 'brijv',
  },
  {
    styles: {},
    content: ['<strong>二、服務</strong> '],
    alignment: 'center',
    type: 'header-two',
    id: '110tr',
  },
  {
    styles: {},
    content: [
      '1. 服務項目：鏡週刊雜誌電子書及鏡週刊特定專欄（包括但不限於人物（一鏡到底、  心內話、財經人物）﹔理財（理財）﹔美食旅遊（美食焦點、廚房密  技、旅行台灣、看見世界、我為物狂）﹔娛樂（鏡大咖、影劇專欄）﹔  深度調查（時代現場、鏡相人間）等）內容。  ',
    ],
    alignment: 'center',
    type: 'unstyled',
    id: 'egfa5',
  },
  {
    styles: {},
    content: [
      '2. 「鏡週刊」將會不定期對會員推出抽獎、促銷及優惠活動，並於鏡週刊網站及鏡週刊社群媒體帳號公告，請密切注意。',
    ],
    alignment: 'center',
    type: 'unstyled',
    id: 'a573',
  },
  {
    styles: {},
    content: [
      '3. 本訂閱服務僅用於提供新聞及資訊性內容為目的，當中納入之新聞及資訊內容，非供交易或投資目的而使用，也不能據此進行交易或投資。  經由本訂閱服務傳送之任何資訊之準確性、可靠性、完整性、即時性、  適用性和供應，「鏡週刊」均不承擔任何責任。基於前開資料之任何交易  或投資決定，「鏡週刊」亦不予負責。  ',
    ],
    alignment: 'center',
    type: 'unstyled',
    id: '3jb2b',
  },
  {
    styles: {},
    content: ['4. 「鏡週刊」保留拒絕、終止訂閱的權利。'],
    alignment: 'center',
    type: 'unstyled',
    id: '9kbut',
  },
  {
    styles: {},
    content: ['<strong>三、會員責任及義務</strong>'],
    alignment: 'center',
    type: 'header-two',
    id: '9e39p',
  },
  {
    styles: {},
    content: ['1. 會員使用本服務，必須同意以下各項條款：'],
    alignment: 'center',
    type: 'unstyled',
    id: 'ek14j',
  },
  {
    styles: {},
    content: [
      [
        '依照會員登記表之申請指示，提供正確 、準確、最新完整資料（以下簡稱  「登記資料」）',
        '保持該個人資料之正確及完整性，並於必要時更新「登記資料」，以確保其  資料正確、準確、最新及完整。 ',
        '服務只供會員個人使用，不得轉讓他人，亦不得與他人共用同一帳戶。 ',
        '會員應即維持並更新會員的個人資料，確保其正確性，以獲取最即時服  務。    「鏡週刊」會不定期發送電子報或優惠活動EDM至會員的註冊信箱，若  會員提供的資料有錯誤、不實、過時或不完整之情況時，或「鏡週刊」有  理由合理懷疑會員所提供的資料為錯誤、不實、過時或不完整時，「鏡週  刊」得不經預告拒絕會員的登記申請及暫停或終止對會員提供服務之一部  或全部，並無需負擔任何責任。  ',
      ],
    ],
    alignment: 'center',
    type: 'unordered-list-item',
    id: 'kbzGQlE1A',
  },
  {
    styles: {},
    content: [
      '2. 會員必須自行提供及維持連結訂閱服務之通訊線路、客端系統硬件及其他裝置，並確定其接收操作正常：',
    ],
    alignment: 'center',
    type: 'unstyled',
    id: 'cct3c',
  },
  {
    styles: {},
    content: [
      '桌面電腦：會員可透過網際網路，瀏覽新聞內容及資訊。支援 HTML5標  準之Google Chrome（最新版本）、Firefox（最新版本）及  Microsoft Internet Explore（11.0 版本或以上，包括 Edge 版本）瀏覽器。 ',
      '手機應用程式（iOS & Android）：會員可透過 Android（5.1版本或以上）   平板電腦、手機、或 iPad、iPhone（iOS 10或以上），瀏覽訂閱內容。 ',
      '手機網頁版 Mobile Web：會員可透過 Android （5.1 版本或以上）平板  電腦、手機、或 iPad、iPhone（iOS 10或以上），瀏覽訂閱內容。  ',
    ],
    alignment: 'center',
    type: 'unordered-list-item',
    id: '70buv',
  },
]
export default {
  components: {
    UiMembershipButtonPrimary,
    UiStoryContentHandler,
  },

  /**
   * Why we comment `fetch()` lifecycle, which get content of service-rule from our database?
   * After the new website of mirrormedia (in Adam/packages/mirrormedia-next) is release, our database currently used will be retired and shut down it services.
   * But we haven't already migrate the content of service-rule into new database yet, so the temporarily solution is write service rule in code.
   * To be noticed that this solution is temporarily, we will migrate the content of service-rule into new database ASAP.
   */
  /*
   * async fetch() {
   *   try {
   *     const postResponse = await this.$fetchPostsFromMembershipGateway({
   *       slug: 'service-rule',
   *       isAudioSiteOnly: false,
   *       clean: 'content',
   *       related: 'article',
   *     })
   *     this.story = postResponse?.items?.[0] ?? {}
   */

  /*
   *     const isTitleExist = this.story.title
   *     const isContentExist = (this.story?.content?.apiData ?? []).length > 0
   *     if (!isTitleExist || !isContentExist) {
   *       if (process.server) {
   *         this.$nuxt.context.res.statusCode = 404
   *       }
   *       throw new Error('not found')
   *     }
   *   } catch (e) {
   *     console.log(
   *       JSON.stringify({
   *         severity: 'ERROR',
   *         message: errors.helpers.printAll(e, {
   *           withStack: true,
   *           withPayload: true,
   *         }),
   *       })
   *     )
   *     this.$nuxt.error({ statusCode: 404 })
   *   }
   * },
   */
  data() {
    return {
      story: {},
      isChecked: false,
    }
  },
  computed: {
    paragraphList() {
      return SERVICE_RULE
    },
  },
  async beforeMount() {
    await redirectDestination.set(this.$route, 'mm-service-rule-destination')
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
    async handleSubmit(e) {
      e.preventDefault()
      try {
        await this.$setMemberServiceRuleStatusToTrue()
        localStorage.setItem('read-service-rule', 'true')
        redirectDestination.redirect('mm-service-rule-destination')
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.service-rule {
  max-width: 680px;
  margin: 24px auto;
  padding: 20px;

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

  &__wrapper {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 21px 12px;
    height: calc(100vh - 500px);
    overflow-y: scroll;
    margin-top: 12px;
    font-size: 13px;
    line-height: 18px;
    color: rgba(0, 0, 0, 0.87);
    @include media-breakpoint-up(md) {
      padding: 40px 35px 40px 40px;
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

  &__agree {
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
</style>
