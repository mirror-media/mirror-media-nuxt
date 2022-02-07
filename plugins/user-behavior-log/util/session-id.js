import { createIdHelper } from '~/plugins/user-behavior-log/util/id'

export default createIdHelper({ name: 'mmid-session', expires: '30m' })
