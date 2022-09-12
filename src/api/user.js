import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/emoUsers/login',
    method: 'post',
    data
  })
}

export function getInfo(state) {
  return request({
    url: '/emoUsers/' + state.id,
    method: 'get',
    params: { access_token: state.token }
  })
}

export function logout(state) {
  return request({
    url: '/emoUsers/logout/' ,
    method: 'post',
    params: { access_token: state.token }
  })
}
