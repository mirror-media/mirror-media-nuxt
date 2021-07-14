import Vue from 'vue'
import { reducedEnvIdExperiment } from './util'
import { ENV, GOOGLE_OPT_CONTAINER_ID } from '~/configs/config'

import experimentsOrigin from '~/experiments'
const experiments = experimentsOrigin.map(reducedEnvIdExperiment)

export default (context, inject) => {
  initializePlugin(experiments, inject)
  setupGoogleOptimizeAtClientSide(experiments, context)
}

function initializePlugin(experiments, inject) {
  if (!experiments) {
    inject(
      'GOExp',
      new Proxy(
        {},
        {
          get() {
            throw new Error(
              '[Google Optimize Experiments Plugin] No Google Optimize experiments definitions in "~/experiments", make sure you had define a experiment before access $GOExp'
            )
          },
        }
      )
    )
  } else {
    inject(
      'GOExp',
      Vue.observable(
        Object.assign.call(null, {}, ...experiments.map(groupExperimentByName))
      )
    )
  }

  function groupExperimentByName(experiment) {
    return {
      [experiment.name]: {
        ...experiment,
      },
    }
  }
}

function setupGoogleOptimizeAtClientSide(experiments, context) {
  if (process.server) {
    return
  }

  gtag('event', 'optimize.callback', {
    callback,
  })

  /*
   * Should be used in scripts placed after the Optimize or GTM
   * installation or the initialization of the dataLayer variable.
   * For more info: https://support.google.com/optimize/answer/9059383
   */
  // Not required if the Google Analytics gtag implementation is used.
  function gtag() {
    window.dataLayer.push(arguments)
  }

  function callback(variant, experimentId) {
    const experiment = experiments.find(function getExperimentIncludeId(
      experiment
    ) {
      return experiment.experimentIds.some(function compareId(idSetting) {
        return idSetting.id === experimentId
      })
    })

    if (!experiment) {
      console.error(
        `[Google Optimize Experiments Plugin] Experiment with
          ID: ${experimentId}
          Container: ${GOOGLE_OPT_CONTAINER_ID}
          current route: ${context.route.fullPath}
        is active on Google Optimize, but ID ${experimentId} on Google Optimize is not found in developer defined experiments ID, please check:`
      )
      console.error(experiments)
      return
    }

    const isExperimentActiveCurrentEnv =
      experiment?.experimentIdActive?.[0]?.id === experimentId
    if (isExperimentActiveCurrentEnv) {
      console.log(
        `[Google Optimize Experiments Plugin] Experiment with
          ID: ${experimentId}
          Container: ${GOOGLE_OPT_CONTAINER_ID}
          current route: ${context.route.fullPath}
        is active on Google Optimize with current ENV: ${ENV}, the variant of the current session is number ${
          +variant + 1
        }`
      )
    } else {
      console.warn(
        `[Google Optimize Experiments Plugin] Experiment with
          ID: ${experimentId}
          Container: ${GOOGLE_OPT_CONTAINER_ID}
          current route: ${context.route.fullPath}
        is active on Google Optimize, but ID ${experimentId} on Google Optimize is not active on current ENV: ${ENV}, please check:`
      )
      console.warn(experiments)
    }
    Vue.set(context.app.$GOExp[experiment.name], 'variant', variant)
  }
}
