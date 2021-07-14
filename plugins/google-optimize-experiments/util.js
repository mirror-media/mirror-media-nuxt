import { ENV } from '~/configs/config'

function getEnv() {
  return ENV ?? 'dev'
}

export function reducedEnvIdExperiment(experiment) {
  return Object.assign({}, experiment, {
    experimentIdActive: experiment.experimentIds.filter(
      function remainExperimentWithCurrentENV(experiment) {
        return experiment.ENV === getEnv()
      }
    ),
  })
}
