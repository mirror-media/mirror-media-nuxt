import debounce from 'lodash/debounce'
import TimeMe from 'timeme.js'
import {
  createUserBehaviorLog,
  isScrollToBottom,
  sendLog,
  premiumStoryInfoForLogger,
  getFormattedPageType,
} from './util'
import dayjs from '~/utils/dayjs'
const debug = require('debug')('user-behavior-log')

export default (context, inject) => {
  inject('sendUserBehaviorLog', function createLogger(log) {
    sendLog({
      ...createUserBehaviorLog(),
      ...log,
    })
  })

  // pageview event
  context.app.router.beforeEach((to, from, next) => {
    /*
     * skip pageview event sent by the plugin if the page is premium-story
     * we send pageview event manually in beforeMount hook in page component
     */
    if (to.name === 'premium-slug') {
      return next()
    }

    try {
      const log = {
        ...createUserBehaviorLog(),
        category: 'whole-site',
        description: '',
        'event-type': 'pageview',
        ...(to.name === 'search'
          ? { keyword: createSearchKeywordValue() }
          : {}),
        'page-type': getFormattedPageType(to.name),
        'member-info-firebase': {
          userEmailVerified:
            context?.store?.state?.membership?.userEmailVerified,
          userSignInInfo: context?.store?.state?.membership?.userSignInInfo,
          userEmail: context?.store?.state?.membership?.userEmail,
          user: context?.store?.state?.membership?.user,
        },

        'member-info-israfel': {
          basicInfo: context?.store?.state?.['membership-subscribe']?.basicInfo,
        },
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
        'page-type': getFormattedPageType(context?.route?.name),
        'member-info-firebase': {
          userEmailVerified:
            context?.store?.state?.membership?.userEmailVerified,
          userSignInInfo: context?.store?.state?.membership?.userSignInInfo,
          userEmail: context?.store?.state?.membership?.userEmail,
          user: context?.store?.state?.membership?.user,
        },
        'member-info-israfel': {
          basicInfo: context?.store?.state?.['membership-subscribe']?.basicInfo,
        },

        'premium-story-info': premiumStoryInfoForLogger(context),
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
  TimeMe.initialize({
    currentPageName: window.location.href,
    idleTimeoutInSeconds: 30,
  })
  window.addEventListener('beforeunload', (event) => {
    try {
      const log = {
        ...createUserBehaviorLog({ target: event.target }),
        category: 'whole-site',
        description: '',
        'event-type': 'exit',
        'page-type': getFormattedPageType(context?.route?.name),
        'exit-time': dayjs
          .utc(Date.now())
          .utcOffset(8)
          .format('YYYY.MM.DD HH:mm:ss'),

        'member-info-firebase': {
          userEmailVerified:
            context?.store?.state?.membership?.userEmailVerified,
          userSignInInfo: context?.store?.state?.membership?.userSignInInfo,
          userEmail: context?.store?.state?.membership?.userEmail,
          user: context?.store?.state?.membership?.user,
        },
        'member-info-israfel': {
          basicInfo: context?.store?.state?.['membership-subscribe']?.basicInfo,
        },

        'premium-story-info': premiumStoryInfoForLogger(context),

        'stay-time-in-seconds': TimeMe.getTimeOnCurrentPageInSeconds(),
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
            'page-type': getFormattedPageType(context?.route?.name),
            'member-info-firebase': {
              userEmailVerified:
                context?.store?.state?.membership?.userEmailVerified,
              userSignInInfo: context?.store?.state?.membership?.userSignInInfo,
              userEmail: context?.store?.state?.membership?.userEmail,
              user: context?.store?.state?.membership?.user,
            },
            'member-info-israfel': {
              basicInfo:
                context?.store?.state?.['membership-subscribe']?.basicInfo,
            },

            'premium-story-info': premiumStoryInfoForLogger(context),
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
          time: dayjs
            .utc(Date.now())
            .utcOffset(8)
            .format('YYYY.MM.DD HH:mm:ss'),
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
