module.exports = {
  moduleNameMapper: {
    '\\.svg\\?.+$': '<rootDir>/test/__mocks__/empty.js',
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
    '\\.css$': '<rootDir>/test/__mocks__/empty.js',
    '@nuxtjs/composition-api': '@nuxtjs/composition-api/lib/entrypoint.js',
  },
  moduleFileExtensions: ['js', 'vue'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
    '\\.(scss|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
  },
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
    '<rootDir>/plugins/**/*.js',
    '<rootDir>/api/**/*.js',
  ],
  setupFiles: [
    '<rootDir>/plugins/vueDirectivesGlobal.js',
    '<rootDir>/plugins/vuePluginsGlobal.js',
    'jest-useragent-mock',
  ],
}
