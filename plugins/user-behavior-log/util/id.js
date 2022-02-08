import Cookie from 'vue-cookie'
import uuidv4 from 'uuid/v4'

export function createIdHelper({ name, expires }) {
  return function getId() {
    let id = Cookie.get(name)
    if (!id) {
      id = setId()
    }
    return id
  }

  function setId() {
    const uuid = uuidv4()
    Cookie.set(name, uuid, { expires })
    return uuid
  }
}
