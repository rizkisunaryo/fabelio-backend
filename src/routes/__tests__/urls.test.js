const assert = require('assert');

const { getClient } = require('../../addOns/mongodb')
const { post } = require('../urls/functions')
const { DATABASE_NAME } = require('../../constants/mongodbConstants')

describe('urls', function () {
    const cleanDb = async () => {
        const client = await getClient()
        const db = client.db(DATABASE_NAME)
        db.dropDatabase()
    }
    beforeEach(cleanDb)
    afterEach(cleanDb)

    const testUrl = 'test url'

    const req = {
        body: {
            url: testUrl
        }
    }
    const res = {
        status: () => res,
        send: () => res,
        json: () => res
    }

    describe('POST /', () => {
        it('should insert URL if not exist', async () => {
            await post(req, res)

            const client = await getClient()
            const db = client.db(DATABASE_NAME)
            const urlsCollection = db.collection('Urls')
            const urls = await urlsCollection.find().toArray()

            assert.equal(urls[0].url, testUrl)
        });

        it('should only insert 1 URL if duplicate', async () => {
            await post(req, res)
            await post(req, res)

            const client = await getClient()
            const db = client.db(DATABASE_NAME)
            const urlsCollection = db.collection('Urls')
            const urls = await urlsCollection.find().toArray()

            assert.equal(urls.length, 1)
        });
    });
});