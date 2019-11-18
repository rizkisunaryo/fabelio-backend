const { sendToQueue } = require('../addOns/rabbitMq')
const { getClient } = require('../addOns/mongodb')
const { DATABASE_NAME } = require('../constants/mongodbConstants')

const timely = 60 * 60 * 1000

const getUrlsFromDb = async () => {
  const client = await getClient()
  const db = client.db(DATABASE_NAME)
  const pagesCollection = db.collection('Pages')
  const urls = await pagesCollection.find().toArray()
  return urls
}

const start = async () => {
  const urlObjectArray = await getUrlsFromDb()
  urlObjectArray.forEach(urlObject => {
    sendToQueue(urlObject.url).catch(() => {
      setTimeout(() => sendToQueue(urlObject.url), 5000)
    })
  })

  setTimeout(() => start(), timely)
}

start()
