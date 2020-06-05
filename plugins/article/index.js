import { getHref } from './href'
import { getImage } from './image'

export default (context, inject) => {
  inject('getHref', getHref)
  inject('getImage', getImage)
}
