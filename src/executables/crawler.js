#!/usr/bin/env node

const amqp = require('amqplib/callback_api')
const puppeteer = require('puppeteer')

const { QUEUE_NAME } = require('../constants/rabbitmqConstants')
const { DATABASE_NAME } = require('../constants/mongodbConstants')
const { getClient } = require('../addOns/mongodb')

const crawl = async url => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    setTimeout(async () => {
      const title = await page.$eval("[data-ui-id='page-title-wrapper']", el => el.innerText)
      const price = await page.$eval('.price', el => el.innerText)
      const images = (await page.$$eval('.fotorama__img', el => el.map(x => x.getAttribute('src'))))
        .slice(3)
        .map(imageUrl => imageUrl.split('thumbnail/88x110').join('image/700x350'))
      const description = await page.$eval('#description', el => el.innerText)
      const pageUpdateObj = {
        title,
        price,
        images,
        description
      }

      const client = await getClient()
      const db = client.db(DATABASE_NAME)

      const pagesCollection = db.collection('Pages')
      await pagesCollection.updateOne(
        { url },
        {
          $set: { ...pageUpdateObj }
        }
      )
    }, 10000)
  } catch (error) {
    console.error(error)
    try {
      const client = await getClient()
      const db = client.db(DATABASE_NAME)
      const pagesCollection = db.collection('Pages')
      await pagesCollection.deleteOne({ url })
    } catch (error2) {
      console.error(error2)
    }
  }
}

const start = () => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      console.error(error0)
      setTimeout(() => start(), 5000)
      return
    }
    connection.createChannel((error1, channel) => {
      if (error1) {
        console.error(error1)
        setTimeout(() => start(), 5000)
        return
      }

      channel.assertQueue(QUEUE_NAME, {
        durable: false
      })

      console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', QUEUE_NAME)

      channel.consume(QUEUE_NAME, msg => {
        const url = msg.content.toString()
        console.log(' [x] Received %s', url)
        crawl(url)
      }, {
        noAck: true
      })
    })
  })
}

start()
