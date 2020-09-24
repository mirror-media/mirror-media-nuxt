import dayjs from 'dayjs'
import { createUserBehaviorLog } from './util'

const debug = require('debug')('user-behavior-log')

export default (context) => {
  // pageview event
  context.app.router.beforeEach((to, from, next) => {
    const payload = {
      category: 'whole-site',
      description: '',
      eventType: 'pageview',
    }
    if (to.name === 'search') {
      payload.keyword = createSearchKeywordValue()
    }
    createUserBehaviorLog(payload)
      .then((log) => {
        debug(
          'Prepare to send pageview event user behavior log to server: ',
          log
        )
        sendLog(log)
      })
      .catch((err) => {
        console.log(err)
      })
    next()

    function createSearchKeywordValue() {
      const keyword = to.params.keyword
      return keyword.split(',')
    }
  })

  // click event
  window.addEventListener('click', (event) => {
    createUserBehaviorLog({
      category: 'whole-site',
      description: '',
      eventType: 'click',
      target: event.target,
    })
      .then((log) => {
        debug(
          'Prepare to send click event user behavior log to server, data: ',
          log
        )
        sendLog(log)
      })
      .catch((err) => {
        console.log(err)
      })
  })

  // exit event
  window.addEventListener('beforeunload', (event) => {
    const now = dayjs(Date.now()).format('YYYY.MM.DD HH:mm:ss')
    createUserBehaviorLog({
      category: 'whole-site',
      description: '',
      eventType: 'exit',
      target: event.target,
      'exit-time': now,
    })
      .then((log) => {
        debug(
          'Prepare to send exit event user behavior log to server, data: ',
          JSON.stringify(log)
        )
        sendLog(log)
      })
      .catch((err) => {
        console.log(err)
      })
  })
}

function sendLog(log) {
  const blob = new Blob([JSON.stringify({ clientInfo: log })], {
    type: 'application/json; charset=UTF-8',
  })
  navigator.sendBeacon('/api/tracking', blob)
}
