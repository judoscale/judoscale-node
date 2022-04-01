import { oneQueue, otherQueue } from './queues'

const oneJob = () => {
  oneQueue.add({})
}

const otherJob = () => {
  otherQueue.add({})
}

oneQueue.process(async (job, done) => {
  console.log('Starting oneQueue')
  const started = new Date()

  while (job) {
    setTimeout(() => {
      job.progress((((new Date()) - started) / 300))
    }, 1000)
  }

  setTimeout(() => {
    console.log('Done!! oneQueue')
    done()
  }, 30000)
})

otherQueue.process(async (job, done) => {
  console.log('Starting otherQueue')
  const started = new Date()

  while (job) {
    setTimeout(() => {
      job.progress((((new Date()) - started) / 300))
    }, 1000)
  }

  setTimeout(() => {
    console.log('Done!! otherQueue')
    done()
  }, 30000)
})

export { oneJob, otherJob }
