import express from 'express'
import judoscale from 'judoscale-express'

const app = express()
const port = process.env.PORT || 5000

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(
  judoscale.default({
    api_base_url: process.env.JUDOSCALE_URL || 'https://judoscale-node-sample.requestcatcher.com',
  })
)

app.get('/', (req, res) => {
  res.render('index', {
    queues: {
      default: 1,
      urgent: 2,
    },
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
