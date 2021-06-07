import verge from 'verge'
import { currentYPosition, elmYPosition } from '../../kc-scroll'
import { isEleFixed, isEleShown } from './comm'

const debug = require('debug')('CLIENT:ADTRACKER')
export const adtracker = ({ el, slot, position, isAdEmpty, sessionId }) => {
  if (!isAdEmpty) {
    let isEverInSight = false
    let isEverViewed = false
    let handler = () => {
      if (isEverViewed) {
        return
      }
      const isPositionFixed = isEleFixed(el)
      const isAdShown = isEleShown(el)
      const deviceHeight = verge.viewportH()
      const currPosTop = !isPositionFixed ? currentYPosition() : 0
      const currPosBottom = !isPositionFixed
        ? currPosTop + deviceHeight
        : deviceHeight
      const elTop = elmYPosition(`#${slot}[sessionId="${sessionId}"]`)

      position === 'MBST' && debug('sessionId', sessionId, elTop)
      if (elTop === undefined) {
        return window.removeEventListener('scroll', handler)
      }

      const elHeight = el.clientHeight || 0
      const elMid = elTop + elHeight / 2
      position === 'MBAR1' &&
        debug(
          `POS: ${position}`,
          currPosTop,
          elMid,
          currPosBottom,
          '. IS IT FIXED?',
          isPositionFixed,
          '. IS IT SHOWN?',
          isAdShown
        )
      if (elMid >= currPosTop && elMid <= currPosBottom && isAdShown) {
        isEverInSight = true
        setTimeout(() => {
          if (isEverViewed) {
            return
          }
          if (isEverInSight) {
            isEverViewed = true
            window.removeEventListener('scroll', handler)
            handler = null
            window.ga &&
              window.ga('send', 'event', 'ad', 'visible', slot, {
                location: document.location.href,
                nonInteraction: false,
              })
            debug(`##${position}# SEND TRACK TICKET.`, {
              slot,
              sessionId,
            })
          }
        }, 1000)
      } else {
        isEverInSight = false
      }
    }
    window.addEventListener('scroll', handler)
    handler()
  } else {
    debug(`##${position}# AD IS EMPTY.`)
  }
}
