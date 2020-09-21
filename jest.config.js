module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '\\.css$': '<rootDir>/test/__mocks__/styleMock.js',
    '@nuxtjs/composition-api': '@nuxtjs/composition-api/lib/cjs/entrypoint.js',
  },
  moduleFileExtensions: ['js', 'vue'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
    '\\.(scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
  ],
  setupFiles: [
    '<rootDir>/plugins/vueDirectivesGlobal.js',
    '<rootDir>/plugins/vuePluginsGlobal.js',
  ],
}
