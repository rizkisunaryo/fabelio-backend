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

    const urlsCollection = db.collection('Urls')
    urlsCollection.createIndex({ url: 1 }, { unique: true })
    try {
        await urlsCollection.insertOne({ url })
        sendToQueue(url)
    } catch (error) {
        res.status(400).json({
            message: 'Duplicate URL'
        })
    }

    res.status(200).send()
}

module.exports = {
    post
}