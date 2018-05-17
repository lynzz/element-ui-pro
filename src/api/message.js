import { get, post } from '../utils/fetch'

/**
 * 获取消息数
 * @param {*} params
 */
export function getMsgCount (status = 1) {
  return get('mgr/messages/baseCount', {status})
}

/**
 * 查询消息
 * @param {*} params
 */
export function queryMsg (params) {
  return get('mgr/messages/base', params)
}

/**
 * 标记消息为已读
 * @param {*} id 消息id
 */
export function markMsg (id) {
  return post(`mgr/messages/base/mark/${id}`)
}

/**
 * 添加消息
 * @param {*} params
 */
export function addMsg (params) {
  return post('mgr/messages', params)
}
