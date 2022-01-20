import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import { createUserBehaviorLog, isScrollToBottom, sendLog } from './util'

const debug = require('debug')('user-behavior-log')

export default (context, inject) => {
  // pageview event
  context.app.router.beforeEach((to, from, next) => {
    try {
      const log = {
        ...createUserBehaviorLog(),
        category: 'whole-site',
        description: '',
        'event-type': 'pageview',
        ...(to.name === 'search'
          ? { keyword: createSearchKeywordValue() }
          : {}),

        'member-info-firebase': context?.store?.state?.membership,
        'member-info-israfel': context?.store?.state?.['membership-subscribe'],
      }

      debug('Prepare to send pageview event user behavior log to server: ', log)
      sendLog(log)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }

    next()

    function createSearchKeywordValue() {
      const keyword = to.params.keyword
      return keyword.split(',')
    }
  })

  // click event
  window.addEventListener('click', (event) => {
    try {
      const log = {
        ...createUserBehaviorLog({ target: event.target }),
        category: 'whole-site',
        description: '',
        'event-type': 'click',

        'member-info-firebase': context?.store?.state?.membership,
        'member-info-israfel': context?.store?.state?.['membership-subscribe'],
      }
      debug(
        'Prepare to send click event user behavior log to server, data: ',
        log
      )
      sendLog(log)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  })

  // exit event
  window.addEventListener('beforeunload', (event) => {
    try {
      const log = {
        ...createUserBehaviorLog({ target: event.target }),
        category: 'whole-site',
        description: '',
        'event-type': 'exit',
        'exit-time': dayjs(Date.now()).format('YYYY.MM.DD HH:mm:ss'),

        'member-info-firebase': context?.store?.state?.membership,
        'member-info-israfel': context?.store?.state?.['membership-subscribe'],
      }
      debug(
        'Prepare to send exit event user behavior log to server, data: ',
        JSON.stringify(log)
      )
      sendLog(log)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    }
  })

  // scroll event
  window.addEventListener(
    'scroll',
    debounce(function (event) {
      if (isScrollToBottom()) {
        try {
          const log = {
            ...createUserBehaviorLog({ target: event.target }),
            category: 'whole-site',
            description: '',
            'event-type': 'scroll-to-bottom',

            'member-info-firebase': context?.store?.state?.membership,
            'member-info-israfel':
              context?.store?.state?.['membership-subscribe'],
          }
          debug(
            'Prepare to send exit event user behavior log to server, data: ',
            JSON.stringify(log)
          )
          sendLog(log)
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err)
        }
      }
    }, 500)
  )

  inject(
    'sendMembershipErrorLog',
    ({
      email = '',
      token = '',
      firebaseId = '',
      memberType = '',
      xstate = '',
      description = '',
      eventType = '',
    } = {}) => {
      try {
        const log = createUserBehaviorLog({
          category: 'membershipErrorLog',
          email,
          token,
          firebaseId,
          memberType,
          xstate,
          description,
          eventType,
          time: dayjs(Date.now()).format('YYYY.MM.DD HH:mm:ss'),
        })
        debug(
          'Prepare to send exit event user behavior log to server, data: ',
          JSON.stringify(log)
        )
        sendLog(log)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err)
      }
    }
  )
}
