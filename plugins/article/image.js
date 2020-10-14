import { SITE_OG_IMG } from '~/constants/index.js'

export function getImage(articleData = {}, sizeType = 'desktop') {
  let image = {}

  // const { heroImage, ogImage, heroVideo } = articleData
  const { heroImage } = articleData

  // if (heroImage) {
  //   image = heroImage.image?.resizedTargets ?? heroImage
  // } else if (ogImage) {
  //   image = ogImage.image?.resizedTargets
  // } else if (heroVideo?.coverPhoto?.image) {
  //   image = heroVideo.coverPhoto.image.resizedTargets
  // }
  if (heroImage) {
    image = heroImage.image.resizedTargets
  }

  return image[sizeType]?.url ?? SITE_OG_IMG
}
