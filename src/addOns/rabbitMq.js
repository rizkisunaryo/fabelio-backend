const amqp = require('amqplib/callback_api');
const { QUEUE_NAME } = require('../constants/rabbitmqConstants')

const sendToQueue = msg => {
    try {
        amqp.connect('amqp://localhost', (error0, connection) => {
            if (error0) {
                throw error0;
            }
            connection.createChannel((error1, channel) => {
                if (error1) {
                    throw error1;
                }

                channel.assertQueue(QUEUE_NAME, {
                    durable: false
                });

                channel.sendToQueue(QUEUE_NAME, Buffer.from(msg));
            });
        });
    } catch (error) {
        console.error('rabbitMq.js: ', error)
    }
}

module.exports = { sendToQueue }