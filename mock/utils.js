var Mock = require('mockjs')

/**
 * 创建 mock
 */
exports.createMock = function (data) {
  return JSON.stringify(
    Mock.mock({
      status: 0,
      data
    })
  )
}
