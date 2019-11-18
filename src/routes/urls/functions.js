const { ObjectID } = require('mongodb')

const { getClient } = require('../../addOns/mongodb')
const { DATABASE_NAME } = require('../../constants/mongodbConstants')
const { sendToQueue } = require('../../addOns/rabbitMq')

const post = async (req, res) => {
    const client = await getClient()
    const db = client.db(DATABASE_NAME)

    const { url } = req.body
    if (!url) {
        res.status(400).json({
            message: 'No URL'
        })
        return
    }

    const pagesCollection = db.collection('Pages')
    pagesCollection.createIndex({ url: 1 }, { unique: true })
    try {
        await pagesCollection.insertOne({ url })
        sendToQueue(url)
    } catch (error) {
        res.status(400).json({
            message: 'Duplicate URL'
        })
    }

    res.status(200).send()
}

const getAll = async (req, res) => {
    let { page } = req.query
    page = Number(page) ? Number(page) : 1
    page = page === 0 ? 1 : page

    const client = await getClient()
    const db = client.db(DATABASE_NAME)
    const pagesCollection = db.collection('Pages')
    const urls = (await pagesCollection.find().skip((page - 1) * 10).limit(10).toArray()).map(({ _id, title, url }) => ({ _id, title, url }))
    res.json({ data: { urls } })
}

const get = async (req, res) => {
    const { id } = req.params
    const client = await getClient()
    const db = client.db(DATABASE_NAME)
    const pagesCollection = db.collection('Pages')
    const url = await pagesCollection.findOne({ _id: ObjectID(id) })
    res.json({ data: { url } })
}

module.exports = {
    get,
    getAll,
    post
}