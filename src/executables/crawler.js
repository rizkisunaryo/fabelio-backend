#!/usr/bin/env node

const amqp = require('amqplib/callback_api')
const { QUEUE_NAME } = require('../constants/rabbitmqConstants')

const crawl = () => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      console.error(error0)
      setTimeout(() => crawl(), 5000)
      return
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error(error1)
        setTimeout(() => crawl(), 5000)
        return
      }

      channel.assertQueue(QUEUE_NAME, {
        durable: false
      })

      console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', QUEUE_NAME)

      channel.consume(QUEUE_NAME, msg => {
        console.log(' [x] Received %s', msg.content.toString())
      }, {
        noAck: true
      })
    })
  })
}

crawl()
