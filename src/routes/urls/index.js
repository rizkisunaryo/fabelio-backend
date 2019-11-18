const express = require('express')
const router = express.Router()

const { post, getAll, get } = require('./functions')

router.get('/:id', get)
router.get('/', getAll)
router.post('/', post)

module.exports = router
