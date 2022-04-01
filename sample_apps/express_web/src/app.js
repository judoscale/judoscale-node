require('dotenv').config()

import express from 'express'
import judoscale from 'judoscale-express'

const app = express()
const port = process.env.PORT || 5000

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(judoscale())

app.get('/', (req, res) => {
  res.render('index', {
    judoscaleIsInstalled: process.env.JUDOSCALE_URL
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
