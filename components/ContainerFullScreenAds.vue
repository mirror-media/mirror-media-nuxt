<template>
  <client-only>
    <div v-if="hasFullScreenAd" class="full-screen-ads">
      <UiFullScreenAd
        v-if="hasAdFirst"
        v-show="isAdFirstVisible"
        :hasDefaultStyle="true"
        :isClosedBtnVisible="isAdFirstClosedBtnVisible"
      >
        <!-- 加 key 的原因：當廣告在 v-if 之間切換時，render 會出現錯誤 -->
        <ContainerGptAd
          key="ad-first"
          pageKey="global"
          adKey="MB_FS"
          @slotRequested="setTimerForClosedBtn"
          @slotRenderEnded="handleAdRenderEndedFirst"
        />
      </UiFullScreenAd>
      <UiFullScreenAd
        v-if="hasAdSecond"
        :hasDefaultStyle="true"
        :isAtBottomStyle="true"
        :isClosedBtnVisible="isAdFirstClosedBtnVisible"
      >
        <!-- 加 key 的原因：當廣告在 v-if 之間切換時，render 會出現錯誤 -->
        <ContainerGptAd
          key="ad-second"
          pageKey="global"
          adKey="MB_BT"
          @slotRequested="setTimerForClosedBtn"
          @slotRenderEnded="handleAdRenderEndedSecond"
        />
      </UiFullScreenAd>
      <UiFullScreenAd
        v-if="hasAdThirdOrFourth"
        :hasModifiedStyle="hasModifiedStyle"
      >
        <ContainerGptAd
          v-if="hasAdThird"
          key="ad-third"
          pageKey="global"
          adKey="MB_AD2"
          @slotRenderEnded="disableModifiedStyle"
        />
        <ContainerGptAd
          v-if="hasAdFourth"
          key="ad-fourth"
          pageKey="global"
          adKey="MB_INNITY"
          @slotRenderEnded="disableModifiedStyle"
        />
      </UiFullScreenAd>
    </div>
  </client-only>
</template>

<script>
import UiFullScreenAd from '~/components/UiFullScreenAd.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'

/**
 * 蓋板廣告有三層，分別為：第一層 FS、第二層BT、第三層 AD2、第四層 Innity
 *
 * 第一層 FS（AdFirst）：
 * 帶有自定義的樣式和關閉按鈕，關閉按鈕在發送廣告請求後，延遲 3 秒才顯示
 * 因為帶有自定義的透明灰底樣式，所以在廣告載入結束後才顯示（isAdFirstVisible）
 * 若沒有 FS 則顯示下一層 FS 廣告
 *
 * 第二層 BT（AdSecond）：
 * 帶有自定義的樣式和關閉按鈕，關閉按鈕在發送廣告請求後，延遲 3 秒才顯示
 * 若沒有 BT 則顯示下一層 AD2 廣告
 *
 * 第三層 AD2（AdThird）:
 * AD2 為不額外帶有樣式的廣告，但因為 GPT Lazy loading 需要知道何時載入的位置
 * 因此需要設置修正用樣式（hasModifiedStyle），來觸發廣告載入
 * 當廣告載入完成後，就將該樣式移除
 *
 * 而 AD2 無法透過 GPT 的事件來確認是否有廣告，跟廠商協調後
 * 當 AD2 沒廣告時，由廠商傳遞 noad2 事件，由我們監聽來顯示下一層 Innity 廣告
 *
 * 第四層 Innity（AdFourth）:
 * 同 AD2 一樣為不額外帶有樣式的廣告，因此需要先設置修正用樣式
 */

export default {
  name: 'ContainerFullScreenAds',
  components: {
    UiFullScreenAd,
    ContainerGptAd,
  },
  data() {
    return {
      hasAdFirst: true,
      hasAdSecond: false,
      hasAdThird: false,
      hasAdFourth: false,
      hasModifiedStyle: true,
      isAdFirstVisible: false,
      isAdFirstClosedBtnVisible: false,
      timerClosedBtn: null,
    }
  },
  computed: {
    hasFullScreenAd() {
      return (
        this.hasAdFirst ||
        this.hasAdSecond ||
        this.hasAdThird ||
        this.hasAdFourth
      )
    },
    hasAdThirdOrFourth() {
      return this.hasAdThird || this.hasAdFourth
    },
  },
  mounted() {
    // AD2 無法透過 GPT 的事件來確認是否有廣告，需要透過此事件來確認
    window.addEventListener('noad2', () => {
      this.hasModifiedStyle = true
      this.hasAdThird = false
      this.hasAdFourth = true
    })
  },
  methods: {
    setTimerForClosedBtn() {
      this.timerClosedBtn = setTimeout(() => {
        this.isAdFirstClosedBtnVisible = true
      }, 3000)
    },
    handleAdRenderEndedFirst(event) {
      if (event.isEmpty) {
        clearTimeout(this.timerClosedBtn)
      }
      this.isAdFirstVisible = true
      this.hasAdFirst = !event.isEmpty
      this.hasAdSecond = event.isEmpty
    },
    handleAdRenderEndedSecond(event) {
      if (event.isEmpty) {
        clearTimeout(this.timerClosedBtn)
      }
      this.hasAdSecond = !event.isEmpty
      this.hasAdThird = event.isEmpty
    },
    disableModifiedStyle() {
      this.hasModifiedStyle = false
    },
  },
}
</script>
