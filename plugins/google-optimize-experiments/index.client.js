import { reducedENVIDExperiment, isExperimentActive } from './util'
import experimentsOrigin from '~/experiments'
const experiments = experimentsOrigin.map(reducedENVIDExperiment)

export default (context, inject) => {
  inject('GOExp', {
    isExperimentActive(experimentName = '') {
      return isExperimentActive.call(this, experimentName)
    },
  })

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
    const experiment = experiments.find(function findExperimentById(
      experiment
    ) {
      return experiment.experimentID === experimentID
    })
    if (experiment) {
      const experimentWithVariant = Object.assign(experiment, { variant })
      const GOExp = Object.assign(context.app.$GOExp, {
        [experimentWithVariant.name]: experimentWithVariant,
      })
      inject('GOExp', GOExp)
    }
  }
}
