const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use((req, res, next) => {
  const arr = [
    new Date().toISOString(),
    req.connection.remoteAddress,
    req.method + ' ' + req.originalUrl,
    JSON.stringify(req.headers),
    JSON.stringify(req.body)
  ]
  console.log(arr.join(' ## '))
  next()
})

const allowedOrigins = process.env.FABELIO_ALLOWED_ORIGINS.split(',')
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      if (allowedOrigins.indexOf(origin) < 0) {
        const msg =
                    'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.'
        return callback(new Error(msg), false)
      }
      return callback(null, true)
    }
  })
)
const port = process.env.NODE_ENV === 'development' ? 3010 : 80

// routes
app.use('/urls', require('../routes/urls'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
