export default {
  mounted() {
    if (
      !this.$config?.recordMemberArticleToggle ||
      !this.orderInfo?.subscriptionId
    ) {
      return
    }

    // return if no subscriptionId provided (payment error) or the subscription is one_time only
    if (
      !this.orderInfo?.subscriptionId ||
      this.orderInfo?.frequency === 'one_time'
    ) {
      return
    }

    /**
     * Upload member's article(story, pre/story) browsing history.
     * Check if the record is existed and is for the logged-in user.
     * Turn record into '{slug},{slug},{slug}' format string.
     * Send gql mutation to save record in subscription's note field.
     */
    const userId = this.$store.state.membership?.userUid
    const nowTs = new Date().valueOf()
    const expireTs = nowTs - this.$config.recordMemberArticleMaxAge * 60 * 1000

    const memberArticleRecords = JSON.parse(
      localStorage.memberArticleRecords || '{}'
    )
    if (memberArticleRecords[userId]) {
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
