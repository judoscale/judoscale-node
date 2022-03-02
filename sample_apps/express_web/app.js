require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const judoscale = require('judoscale-node')

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(judoscale())

app.get('/', (req, res) => {
  res.render('index', {
    judoscaleIsInstalled: process.env.JUDOSCALE_URL,
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
