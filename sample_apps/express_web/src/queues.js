require('dotenv').config()

const Queue = require('bull')

const oneQueue = new Queue('one queue', process.env.REDIS_URL)
const otherQueue = new Queue('other queue', process.env.REDIS_URL)

export {
  oneQueue,
  otherQueue
}
