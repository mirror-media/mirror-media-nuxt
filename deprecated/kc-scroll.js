/**
 * 注意：
 * 此份檔案絕大部分是直接從舊專案 plate-vue 搬過來，並未重構，內容也可能有錯
 * 未來若想使用相關功能，請找可信賴並有持續在維護的第三方套件
 */

function currentYPosition() {
  // Firefox, Chrome, Opera, Safari
  if (self.pageYOffset) {
    return self.pageYOffset
  }

  // Internet Explorer 6 - standards mode
  if (document.documentElement && document.documentElement.scrollTop) {
    return document.documentElement.scrollTop
  }

  // Internet Explorer 6, 7 and 8
  if (document.body.scrollTop) {
    return document.body.scrollTop
  }
  return 0
}

function elmYPosition(eID, errHandler) {
  const elm = document.querySelector(eID)
  if (!elm) {
    errHandler &&
      errHandler({
        message: 'cannot find element' + eID,
      })
    return
  }
  let y = elm.offsetTop
  let node = elm
  // eslint-disable-next-line eqeqeq
  while (node.offsetParent && node.offsetParent != document.body) {
    node = node.offsetParent
    y += node.offsetTop
  }
  return y
}

function smoothScroll(eID, yPos, steps) {
  smoothScrollTo({ eID, yPos, steps })
}

function smoothScrollTo({ eID, yPos, steps }) {
  const startY = currentYPosition()
  const stopY = yPos !== null && yPos !== undefined ? yPos : elmYPosition(eID)
  const distance = stopY > startY ? stopY - startY : startY - stopY
  if (distance < 100) {
    scrollTo(0, stopY)
    return
  }
  let speed = Math.round(distance / 50)

  // do scrollTo after every single 'speed'
  if (speed > 20) speed = 20
  if (speed < 10) speed = 10

  const _stepTimes = steps !== null && steps !== undefined ? steps : 25
  const step = Math.round(distance / _stepTimes)

  // do scrollTo for every 'step'px for 25 times
  let leapY = stopY > startY ? startY + step : startY - step
  let timer = 1
  if (stopY > startY) {
    for (let i = startY; i < stopY; i += step) {
      // eslint-disable-next-line no-implied-eval
      setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed)
      leapY += step
      if (leapY > stopY) leapY = stopY
      timer += 1
    }
    return
  }
  for (let i = startY; i > stopY; i -= step) {
    // eslint-disable-next-line no-implied-eval
    setTimeout('window.scrollTo(0, ' + leapY + ')', timer * speed)
    leapY -= step
    if (leapY < stopY) leapY = stopY
    timer += 1
  }
}

class OnePageScroller {
  construct() {
    this.init = this.init.bind(this)
    this.moveDown = this.moveDown.bind(this)
    this.moveUp = this.moveUp.bind(this)
    this.moveTo = this.moveTo.bind(this)
    this.setUpSwiperBehavior = this.setUpSwiperBehavior.bind(this)
    this.setUpMouseWheelBehavior = this.setUpMouseWheelBehavior.bind(this)
    this.setUpResponsiveBehavior = this.setUpResponsiveBehavior.bind(this)
    this.setUpKeyDownBehavior = this.setUpKeyDownBehavior.bind(this)
    this.transformPage = this.transformPage.bind(this)
    this._init_scroll = this._init_scroll.bind(this)
    this._addClass = this._addClass.bind(this)
    this._removeClass = this._removeClass.bind(this)
    this._hasClass = this._hasClass.bind(this)
    this._trim = this._trim.bind(this)
    this._whichTransitionEvent = this._whichTransitionEvent.bind(this)
    this._isDescendant = this._isDescendant.bind(this)
    this.isDescendant = this.isDescendant.bind(this)
    this.pauseToggle = this.pauseToggle.bind(this)
    this.cancelPause = this.cancelPause.bind(this)
    this.doPause = this.doPause.bind(this)

    this.defaults = {
      pageContainer: 'section',
      easing: 'ease',
      animationTime: 1000,
      keyboard: true,
      beforeMove: null,
      afterMove: null,
      loop: false,
      responsiveFallback: false,
      defaultInitialPage: 1,
    }
    this.settings = {}
    this.pages = {}
    this.doc = document
    this.lastAnimation = 0
    this.quietPeriod = 500
    this.container = {}
    this.scrollingFlag = false
    this.initializedFlag = false
    this.containerSlector = 'body'
    this.options = {}
    this.pauseFlag = false
    this.height = window.innerHeight
  }

  init(container, options) {
    this.defaults = {
      pageContainer: 'section',
      easing: 'ease',
      animationTime: 1000,
      quietPeriod: 500,
      keyboard: true,
      beforeMove: null,
      afterMove: null,
      loop: false,
      responsiveFallback: false,
      defaultInitialPage: 1,
    }
    this.doc = document
    this.settings = Object.assign({}, this.defaults, options)
    this.container = this.doc.querySelector(container)
    this.pages = this.container.querySelectorAll(this.settings.pageContainer)
    this.pauseFlag = false
    this.scrollingFlag = false
    this.containerSlector = container
    this.options = options
    this.height = window.innerHeight

    const pagesLeng = this.pages.length

    this.quietPeriod = this.settings.quietPeriod

    for (let i = 0; i < pagesLeng; i += 1) {
      this.pages[i].dataset.index = i + 1

      if (i !== 0) {
        this._removeClass(this.pages[i], 'active')
      } else {
        this._addClass(this.pages[i], 'active')
      }
    }

    this.setUpSwiperBehavior()
    this.setUpMouseWheelBehavior()
    this.setUpResponsiveBehavior()

    if (this.settings.keyboard === true) {
      this.setUpKeyDownBehavior()
    }
    if (this.settings.defaultInitialPage !== 1) {
      this.moveTo(this.settings.defaultInitialPage)
    }

    this.initializedFlag = true
  }

  setUpSwiperBehavior() {
    return new Promise((resolve) => {
      let touchStartY
      const _touchMove = (evt) => {
        const touches = evt.touches
        if (touches && touches.length) {
          evt.preventDefault()

          const deltaY = touchStartY - touches[0].pageY

          if (deltaY >= 50 && this.scrollingFlag !== true) {
            const event = new Event('pageUp')
            this.doc.dispatchEvent(event)
            this.scrollingFlag = true
          }
          if (deltaY <= -50 && this.scrollingFlag !== true) {
            const event = new Event('pageDown')
            this.doc.dispatchEvent(event)
            this.scrollingFlag = true
          }
        }
      }
      const _touchStart = (evt) => {
        const touches = evt.touches

        const ifTargIncludedInContainer = this._isDescendant(
          this.container,
          evt.target
        )
        if (!ifTargIncludedInContainer) {
          return
        }
        if (touches && touches.length) {
          touchStartY = touches[0].pageY
          this.scrollingFlag = false
          this.doc.addEventListener('touchmove', _touchMove, {
            passive: false,
            cancelable: true,
          })
        }
      }
      this.doc.addEventListener('touchstart', _touchStart)
      this.doc.addEventListener('touchend', () => {
        this.doc.removeEventListener('touchmove', _touchMove, {
          passive: false,
          cancelable: true,
        })
      })
      this.doc.addEventListener('pageDown', (evt) => {
        !this.pauseFlag && evt.preventDefault()
        !this.pauseFlag && this.moveUp()
      })
      this.doc.addEventListener('pageUp', (evt) => {
        !this.pauseFlag && evt.preventDefault()
        !this.pauseFlag && this.moveDown()
      })
      resolve()
    })
  }

  setUpMouseWheelBehavior() {
    return new Promise((resolve) => {
      const _mouseWheelHandler = (evt) => {
        const ifTargIncludedInContainer = this._isDescendant(
          this.container,
          evt.target
        )
        if (!ifTargIncludedInContainer) {
          return
        }
        const delta = evt.wheelDelta || -evt.detail
        !this.pauseFlag && evt.preventDefault()
        !this.pauseFlag && this._init_scroll(evt, delta)
      }
      this.doc.addEventListener('mousewheel', _mouseWheelHandler, {
        passive: false,
      })
      this.doc.addEventListener('DOMMouseScroll', _mouseWheelHandler)
      resolve()
    })
  }

  setUpResponsiveBehavior() {
    return new Promise((resolve) => {
      window.addEventListener('resize', () => {})
      resolve()
    })
  }

  setUpKeyDownBehavior() {
    return new Promise((resolve) => {
      const _keydownHandler = (evt) => {
        const _tagName = evt.target.tagName.toLowerCase()

        switch (evt.which) {
          case 38:
            // eslint-disable-next-line eqeqeq
            if (_tagName != 'input' && _tagName != 'textarea') {
              this.moveUp()
            }
            break
          case 40:
            // eslint-disable-next-line eqeqeq
            if (_tagName != 'input' && _tagName != 'textarea') {
              this.moveDown()
            }
            break
          default:
            return
        }

        return false
      }
      this.doc.onkeydown = _keydownHandler
      resolve()
    })
  }

  moveDown() {
    const index = this.doc.querySelector(
      this.settings.pageContainer + '.active'
    ).dataset.index
    const current = this.doc.querySelector(
      this.settings.pageContainer + '[data-index="' + index + '"]'
    )
    let next = this.doc.querySelector(
      this.settings.pageContainer +
        '[data-index="' +
        (parseInt(index) + 1) +
        '"]'
    )
    let pos = 0

    if (!next) {
      // eslint-disable-next-line eqeqeq
      if (this.settings.loop == true) {
        pos = 0
        next = this.doc.querySelector(
          this.settings.pageContainer + '[data-index="1"]'
        )
      } else {
        return
      }
    } else {
      pos = index * 100 * -1
    }
    const nextIndex = next.dataset.index
    this._removeClass(current, 'active')
    this._addClass(next, 'active')
    this._transformPage(pos, nextIndex, next)
  }

  moveUp() {
    const index = this.doc.querySelector(
      this.settings.pageContainer + '.active'
    ).dataset.index
    const current = this.doc.querySelector(
      this.settings.pageContainer + '[data-index="' + index + '"]'
    )
    // eslint-disable-next-line prefer-const
    let next = this.doc.querySelector(
      this.settings.pageContainer +
        '[data-index="' +
        (parseInt(index) - 1) +
        '"]'
    )
    let pos = 0

    if (!next) {
      // eslint-disable-next-line eqeqeq
      if (this.settings.loop == true) {
        // pos = (total - 1) * 100 * -1
        // next = this.doc.querySelector(
        //   this.settings.pageContainer + '[data-index="' + total + '"]'
        // )
      } else {
        return
      }
    } else {
      pos = (next.dataset.index - 1) * 100 * -1
    }
    const nextIndex = next.dataset.index
    this._removeClass(current, 'active')
    this._addClass(next, 'active')

    // eslint-disable-next-line eqeqeq
    if (this.settings.pagination == true) {
      this._removeClass(
        this.doc.querySelector(
          '.onepage-pagination li a' + '[data-index="' + index + '"]'
        ),
        'active'
      )
      this._addClass(
        this.doc.querySelector(
          '.onepage-pagination li a' + '[data-index="' + nextIndex + '"]'
        ),
        'active'
      )
    }

    this._transformPage(pos, nextIndex, next)
  }

  moveTo(pageIndex) {
    const current = this.doc.querySelector(
      this.settings.pageContainer + '.active'
    )
    const next = this.doc.querySelector(
      this.settings.pageContainer + "[data-index='" + pageIndex + "']"
    )
    let pos = 0
    if (next) {
      this._removeClass(current, 'active')
      this._addClass(next, 'active')

      pos = (pageIndex - 1) * 100 * -1
      this._transformPage(pos, pageIndex, next)
    }
  }

  // eslint-disable-next-line camelcase
  _init_scroll(event, delta) {
    const deltaOfInterest = delta
    const timeNow = new Date().getTime()

    // Cancel scroll if currently animating or within quiet period
    if (
      timeNow - this.lastAnimation <
        this.quietPeriod + this.settings.animationTime ||
      this.pauseFlag === true
    ) {
      event.preventDefault()
      return
    }

    if (deltaOfInterest < 0) {
      this.moveDown()
    } else {
      this.moveUp()
    }
    this.lastAnimation = timeNow
  }

  _addClass(ele, cls) {
    if (!this._hasClass(ele, cls)) {
      ele.className += ' ' + cls
    }
    ele.className = this._trim(ele.className)
  }

  _removeClass(ele, cls) {
    if (this._hasClass(ele, cls)) {
      const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
      ele.className = ele.className.replace(reg, ' ')
    }
    ele.className = this._trim(ele.className)
  }

  _hasClass(ele, cls) {
    if (ele.className) {
      return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
    } else {
      return (ele.className = cls)
    }
  }

  _trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
  }

  _transformPage(pos, index, nextEl) {
    if (typeof this.settings.beforeMove === 'function') {
      this.settings.beforeMove(index, nextEl)
    }

    const transformCSS = `
      touch-action: none;
      -webkit-transform: translate3d(0, ${pos}%, 0);
      -webkit-transition: -webkit-transform ${this.settings.animationTime}ms ${this.settings.easing};
      -moz-transform: translate3d(0, ${pos}%, 0);
      -moz-transition: -moz-transform ${this.settings.animationTime}ms ${this.settings.easing};
      -ms-transform: translate3d(0, ${pos}%, 0);
      -ms-transition: -ms-transform ${this.settings.animationTime}ms ${this.settings.easing};
      transform: translate3d(0, ${pos}%, 0);
      transition: all ${this.settings.animationTime}ms ${this.settings.easing};`

    this.container.style.cssText = transformCSS

    const transitionEnd = this._whichTransitionEvent()
    const endAnimation = () => {
      if (typeof this.settings.afterMove === 'function') {
        this.settings.afterMove(index)
      }

      this.container.removeEventListener(transitionEnd, endAnimation)
    }
    this.container.addEventListener(transitionEnd, endAnimation, false)
  }

  _whichTransitionEvent() {
    const el = document.createElement('fakeelement')
    const transitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
    }

    for (const t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t]
      }
    }
  }

  _isDescendant(parent, child) {
    let node = child.parentNode
    while (node !== null) {
      if (node === parent) {
        return true
      }
      node = node.parentNode
    }
    return false
  }

  pauseToggle() {
    this.pauseFlag = !this.pauseFlag
  }

  cancelPause() {
    this.pauseFlag = false
  }

  doPause() {
    this.pauseFlag = true
  }
}

export { currentYPosition, elmYPosition, smoothScroll, OnePageScroller }
