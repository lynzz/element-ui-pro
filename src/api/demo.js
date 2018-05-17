import { get } from '../utils/fetch'

export function queryLab (params) {
  return get('lab', params)
}
