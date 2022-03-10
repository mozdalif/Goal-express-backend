const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const connectDB = require('./config/db')

connectDB()

const app = express();

// router import 
const goalRoutes = require('./routes/goalRoutes')



app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// main routes
app.get('/home', (req, res) => {
  res.json({ home: "this is home" })
})

app.use('/api/goals', require('./routes/goalRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

app.use(require('./middleware/errorMiddleware').errorHandler)



app.listen(port, () => console.log(`Server started on port ${port}`))