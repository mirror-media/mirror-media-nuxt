import { camelizeKeys } from 'humps'

export default async function fetchDefaultCommonData({ store, $axios }) {
  const [comboResult, partnerResult] = await Promise.allSettled([
    fetchComboData($axios),
    fetchPartnerData($axios),
  ])

  if (comboResult.status === 'fulfilled') {
    const { endpoints = {} } = camelizeKeys(comboResult.value.data)

    store.commit('setSectionsData', endpoints.sections ?? {})
    store.commit('setTopicsData', endpoints.topics ?? {})
  }

  if (partnerResult.status === 'fulfilled') {
    store.commit('setPartnersData', camelizeKeys(partnerResult.value.data))
  }
}

function fetchComboData($axios) {
  return $axios.get(
    'https://api.mirrormedia.mg/combo?endpoint=sections&endpoint=topics'
  )
}

function fetchPartnerData($axios) {
  return $axios.get('https://api.mirrormedia.mg/partners?max_results=25&page=1')
}
