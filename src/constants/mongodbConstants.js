module.exports = {
  DATABASE_NAME: process.env.NODE_ENV === 'testing' ? 'fabelio_test' : 'fabelio'
}
