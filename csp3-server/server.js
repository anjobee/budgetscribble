import express from 'express'
import path from 'path'
import colors from 'colors'
import dotenv from 'dotenv'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import transactionRoutes from './routes/transactionRoutes.js'
import cors from 'cors'

dotenv.config()

connectDB()

const app = express()

app.use(cors())

app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/transactions', transactionRoutes)

const __dirname = path.resolve()
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/csp3-client/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'csp3-client', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('Server is running...')
  })
}

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold
  )
})
