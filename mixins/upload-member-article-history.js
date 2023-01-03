export default {
  mounted() {
    const userId = this.$store.state.membership?.userUid
    const nowTs = new Date().valueOf()
    const expireTs = nowTs - 30 * 60 * 1000

    const memberArticleRecords = JSON.parse(
      localStorage.memberArticleRecords || '{}'
    )
    if (memberArticleRecords[userId] && this.subscriptionId) {
      const articleRecords = memberArticleRecords[userId].filter(
        (record) => record.ts > expireTs
      )
      if (!articleRecords.length) {
        return
      }
      const note = articleRecords.reduce((pre, next) => {
        if (!pre) {
          return pre + next.slug
        } else {
          return pre + ',' + next.slug
        }
      }, '')

      this.$updateSubscriptionNote(this.orderInfo.subscriptionId, note).then(
        () => localStorage.removeItem('memberArticleRecords')
      )
    }
  },
}
