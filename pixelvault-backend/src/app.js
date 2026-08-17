const cors = require('cors')
const express = require('express')

const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/error.middleware')
const productRoutes = require('./routes/product.routes')
const promotionCodeRoutes = require('./routes/promotionCode.routes')
const shippingOptionRoutes = require('./routes/shippingOption.routes')

function getAllowedOrigins() {
  return String(
    process.env.CLIENT_ORIGINS
    || 'http://localhost:5173,http://127.0.0.1:5173',
  )
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

const allowedOrigins = getAllowedOrigins()
const app = express()

app.disable('x-powered-by')

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    const error = new Error(
      `El origen ${origin} no está autorizado para usar esta API.`,
    )
    error.statusCode = 403
    return callback(error)
  },
}))

app.use(express.json({ limit: '1mb' }))

app.get('/', (request, response) => {
  response.json({
    message: 'PixelVault API está funcionando correctamente.',
    database: process.env.MONGO_DB_NAME || 'pixelvault',
  })
})

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/products', productRoutes)
app.use('/api/promotion-codes', promotionCodeRoutes)
app.use('/api/shipping-options', shippingOptionRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
