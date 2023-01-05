export default {
  mounted() {
    // return if feature toggle is off or no slug to record
    if (!this.$config?.recordMemberArticleToggle || !this.storySlug) {
      return
    }

    /**
     * Save member's article(story, pre/story) browsing history.
     * Renew the localStorage.memberArticleRecors every time with fresh record corresponding to the logged-in user.
     * Use .env MEMBER_ARTICLE_HISTORY_MAX_AGE to dynamic change max age.
     */
    const userId = this.$store.state.membership?.userUid
    const articleSlug = this.storySlug
    if (userId) {
      const nowTs = new Date().valueOf()
      const expireTs =
        nowTs - this.$config.recordMemberArticleMaxAge * 60 * 1000
      const newArticleRecord = { ts: nowTs, slug: articleSlug }
      const newMemberArticleRecords = {}
      const memberArticleRecords = JSON.parse(
        localStorage.memberArticleRecords || '{}'
      )

      if (memberArticleRecords[userId]) {
        let articleRecords = memberArticleRecords[userId]
        articleRecords = articleRecords.filter((record) => record.ts > expireTs)
        articleRecords.push(newArticleRecord)
        newMemberArticleRecords[userId] = articleRecords
      } else {
        newMemberArticleRecords[userId] = [newArticleRecord]
      }
      localStorage.memberArticleRecords = JSON.stringify(
        newMemberArticleRecords
      )
    }
  },
}
