import { get as axiosGet } from 'axios'
import { camelizeKeys } from 'humps'

export default async function fetchDefaultCommonData({ store }) {
  // const [comboData, partnerData] = await axiosAll([
  //   fetchComboData(),
  //   fetchPartnerData(),
  // ])

  const { data: comboData = {} } = await fetchComboData()
  store.commit(
    'setSectionsData',
    camelizeKeys(comboData).endpoints?.sections ?? {}
  )
  store.commit('setTopicsData', camelizeKeys(comboData).endpoints?.topics ?? {})

  const { data: partnerData = {} } = await fetchPartnerData()
  store.commit('setPartnersData', camelizeKeys(partnerData))
}

function fetchComboData() {
  return axiosGet(
    'https://api.mirrormedia.mg/combo?endpoint=sections&endpoint=topics'
  )
}

function fetchPartnerData() {
  return axiosGet('https://api.mirrormedia.mg/partners?max_results=25&page=1')
}
