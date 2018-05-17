/**
 * 去掉重复
 * @param {Array} value 数组值
 */
export function uniq (value) {
  let setValue = new Set(value)
  return Array.from(setValue)
}

export const isObject = val => {
  return Object.prototype.toString.call(val).toLowerCase() === '[object object]'
}
