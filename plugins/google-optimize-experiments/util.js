const { ENV = 'dev' } = require('~/configs/config')
function getEnv() {
  if (ENV === 'staging') {
    return 'prod'
  }
  return ENV
}

export function reducedENVIDExperiment(experiment) {
  return Object.assign(experiment, {
    experimentID: experiment.experimentID[getEnv()],
  })
}
