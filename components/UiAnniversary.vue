<template>
  <div class="member-info">
    鏡週刊訂閱制上線，讓有價的閱聽成就更多優質文章，並獻上無廣告的閱讀環境，讓您盡情享受15類會員專屬內容，誠摯邀請您
    <strong @click="enterMemberSectionPage">立即加入</strong>。
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isLoggedIn: 'membership/isLoggedIn',
    }),
  },
  methods: {
    enterMemberSectionPage() {
      this.enterPageAfterLoggedIn('/subscribe')
      this.$ga.event({
        eventCategory: 'article',
        eventAction: 'click',
        eventLabel: 'member section',
      })
    },
    enterPageAfterLoggedIn(pagePath) {
      if (this.isLoggedIn) {
        window.location.href = pagePath
      } else {
        window.location.href = `/login/?destination=${pagePath}`
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.member-info {
  padding: 32px;
  color: #fff;
  font-size: 19.2px;
  line-height: 36px;
  text-align: justify;
  background-color: #054f77;

  strong {
    cursor: pointer;
    color: #eac151;
    font-weight: 600;
    border-bottom: 1px solid #eac151;
  }

  p {
    color: #eac151;
  }
}
</style>
