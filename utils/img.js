import { SITE_OG_IMG } from '~/constants/index.js'

function gainImgSrcById(items, id) {
  const item = items.find((item) => item.id === id) || {}

  return item.image?.resizedTargets?.mobile?.url || SITE_OG_IMG
}

export { gainImgSrcById }
