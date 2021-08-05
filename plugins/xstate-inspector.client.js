import { inspect } from '@xstate/inspect'
import { isMemberSubscribeFeatureToggled } from '~/xstate/member-subscribe/util'

export default function (context) {
  if (isMemberSubscribeFeatureToggled(context.route)) {
    inspect({
      /*
       * options
       * url: 'https://statecharts.io/inspect', // (default)
       */
      iframe: false, // open in new window
    })
  }
}
