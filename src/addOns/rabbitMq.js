const amqp = require('amqplib/callback_api')
const { QUEUE_NAME } = require('../constants/rabbitmqConstants')

const sendToQueue = msg => new Promise((resolve, reject) => {
  try {
    amqp.connect('amqp://localhost', (error0, connection) => {
      if (error0) {
        reject(error0)
        return
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          reject(error1)
          return
        }

        channel.assertQueue(QUEUE_NAME, {
          durable: false
        })

        channel.sendToQueue(QUEUE_NAME, Buffer.from(msg))
        resolve()
      })
    })
  } catch (error) {
    console.error('rabbitMq.js: ', error)
    reject(error)
  }
})

module.exports = { sendToQueue }
