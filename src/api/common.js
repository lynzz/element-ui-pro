import { get } from '../utils/fetch'

/**
 * 获取省列表
 */
export function queryProvince (params) {
  return get('common/province/list', params)
}

/**
 * 根据省获取市列表
 * @param {*} provinceId 省id
 */
export function queryCity (params) {
  return get('common/city/listByProvinceId', params)
}

/**
 * 根据市获取区域列表
 * @param {*} cityId 市id
 */
export function queryArea (params) {
  return get('common/area/listByCityId', params)
}
