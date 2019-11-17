const express = require('express')
const router = express.Router()

const { post } = require('./functions')

router.post('/', post)

module.exports = router
