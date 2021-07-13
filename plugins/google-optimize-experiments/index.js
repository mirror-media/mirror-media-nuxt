import Vue from 'vue'
import { reducedENVIDExperiment } from './util'
import experimentsOrigin from '~/experiments'
const experiments = experimentsOrigin.map(reducedENVIDExperiment)

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
        experimentID: experiment.experimentID,
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

  function callback(variant, experimentID) {
    console.log(
      `[Google Optimize Experiments Plugin] Experiment with ID ${experimentID} is active on Google Optimize of current route ${
        context.route.fullPath
      }, the variant of the current session is number ${+variant + 1}`
    )
    const experiment = experiments.find(findExperimentByID(experimentID))
    if (experiment) {
      Vue.set(context.app.$GOExp[experiment.name], 'variant', variant)
    }
  }

  function findExperimentByID(experimentID) {
    return function (experiment) {
      return experiment.experimentID === experimentID
    }
  }
}
