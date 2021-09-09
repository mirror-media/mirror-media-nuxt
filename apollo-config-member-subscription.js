import { API_PATH_FRONTEND } from '~/configs/config'

// https://github.com/nuxt-community/apollo-module#apollo-clientoptions-using-file-configuration

export default (context) => {
  return {
    httpEndpoint: `http://localhost:3000/${API_PATH_FRONTEND}/member-subscription/v0`,
    browserHttpEndpoint: `/${API_PATH_FRONTEND}/member-subscription/v0`,

    /*
     * For permanent authentication provide `getAuth` function.
     * The string returned will be used in all requests as authorization header
     */
    getAuth: () => `Bearer ${context.store.state.membership.userToken}`,
  }
}
