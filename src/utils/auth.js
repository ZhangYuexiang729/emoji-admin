import Cookies from 'js-cookie'

const IDKey = 'Admin-ID'
const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}


export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getId() {
  return Cookies.get(IDKey)
}

export function setId(id) {
  return Cookies.set(IDKey, id)
}

export function removeId() {
  return Cookies.remove(IDKey)
}
