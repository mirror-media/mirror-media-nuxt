import { isElementAlink } from './util'

export default function getRref(eventTarget) {
  if (isElementAlink(eventTarget)) {
    if (eventTarget?.id?.startsWith('related')) {
      return 'related'
    } else if (eventTarget?.id?.startsWith('recommend')) {
      return 'recommend'
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
