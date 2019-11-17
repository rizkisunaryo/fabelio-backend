const MongoClient = require('mongodb').MongoClient

// Create a new MongoClient
const client = new MongoClient(process.env.FABELIO_MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const getClient = async () => {
  try {
    await client.connect()
  } catch (error) {
    console.log('MongoDB error when trying to connect: ', error)
  }
  return client
}

module.exports = {
  getClient
}
