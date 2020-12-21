// https://github.com/nuxt-community/apollo-module#apollo-clientoptions-using-file-configuration

export default (context) => {
  return {
    httpEndpoint: 'http://localhost:3000/api/membership/v1/graphql/user',
    browserHttpEndpoint: '/api/membership/v1/graphql/user',

    /*
     * For permanent authentication provide `getAuth` function.
     * The string returned will be used in all requests as authorization header
     */
    getAuth: () => `Bearer ${context.store.state.membership.userToken}`,
  }
}
