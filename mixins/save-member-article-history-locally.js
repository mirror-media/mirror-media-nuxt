export default {
  mounted() {
    const userId = this.$store.state.membership?.userUid
    const articleSlug = this.storySlug
    if (userId) {
      const nowTs = new Date().valueOf()
      const expireTs = nowTs - 30 * 60 * 1000
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
