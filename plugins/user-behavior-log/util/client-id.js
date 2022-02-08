import { createIdHelper } from '~/plugins/user-behavior-log/util/id'

export default createIdHelper({ name: 'mmid', expires: `${10 * 365 * 24}h` })
