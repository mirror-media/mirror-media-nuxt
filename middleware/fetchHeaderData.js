import { get as axiosGet, all as axiosAll } from 'axios'
import _ from 'lodash'

export default async function fetchHeaderData({ store }) {
  const [comboData, partnerData] = await axiosAll([
    fetchComboData(),
    fetchPartnerData(),
  ])

  store.commit(
    'setSectionsData',
    _.get(comboData, 'data._endpoints.sections', {})
  )
  store.commit('setTopicsData', _.get(comboData, 'data._endpoints.topics', {}))
  store.commit('setPartnersData', _.get(partnerData, 'data', {}))
}

function fetchComboData() {
  return axiosGet(
    'https://api.mirrormedia.mg/combo?endpoint=sections&endpoint=topics'
  )
}

function fetchPartnerData() {
  return axiosGet('https://api.mirrormedia.mg/partners?max_results=25&page=1')
}
