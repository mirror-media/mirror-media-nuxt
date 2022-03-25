import { inspect } from '@xstate/inspect'
import { isMemberSubscribeFeatureToggled } from '~/xstate/member-subscribe/util'

export default function (context) {
  if (isMemberSubscribeFeatureToggled() && Boolean(context.route.query.ms)) {
    inspect({
      /*
       * options
       * url: 'https://statecharts.io/inspect', // (default)
       */
      iframe: false, // open in new window
    })
  }
}
