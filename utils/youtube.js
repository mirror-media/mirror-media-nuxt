function isValidYoutubeVideo(item) {
  // for specific title from Youtube response data
  const invalidTitles = ['Deleted video', 'Private video']
  return !invalidTitles.includes(item.snippet?.title)
}

function restructureItem(item) {
  return {
    videoId: item.id?.videoId || item.snippet?.resourceId?.videoId || item.id,
    title: item.snippet?.title,
    thumbnails: item.snippet?.thumbnails?.high?.url,
    privacyStatus: item.status?.privacyStatus,
  }
}

export function processResponseItems(response = {}) {
  const items = response.items ?? []
  return items.filter(isValidYoutubeVideo).map(restructureItem)
}
