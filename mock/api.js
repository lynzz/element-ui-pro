var express = require('express')
var router = express.Router()
var utils = require('./utils')

router.post('/login', (req, res) => {
  res.end(
    utils.createMock({
      data: '13334'
    })
  )
})

router.post('/logout', (req, res) => {
  res.end(
    utils.createMock({
      data: '133345'
    })
  )
})

router.get('/lab', (req, res) => {
  res.end(
    utils.createMock({
      'data|10': [
        {
          id: '@id',
          labName: '@name',
          province: '@province',
          city: '@city',
          createDate: '@datetime'
        }
      ]
    })
  )
})

router.get('/kaptcha', (req, res) => {
  res.end(
    utils.createMock({
      data: '@image("40*40")'
    })
  )
})

module.exports = router
