import { post, getFileUrl } from '../utils/fetch'

export function login (params) {
  return post('login', params)
}

export function logout () {
  return post('logout')
}

/**
 * 获取验证码
 * @export
 * @param {any} time 时间戳
 */
export function validCodeUrl (time) {
  return getFileUrl('kaptcha', { time })
}

export function changePwd (params) {
  return post('changePwd', params)
}
