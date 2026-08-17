require('dotenv').config()

const mongoose = require('mongoose')

const app = require('./app')
const connectDB = require('./config/db')

const port = Number(process.env.PORT) || 3000
let server = null

async function startServer() {
  try {
    await connectDB()

    server = app.listen(port, '0.0.0.0', () => {
      console.log(`PixelVault API disponible en http://localhost:${port}.`)
    })
  } catch (error) {
    console.error(`No fue posible iniciar PixelVault API: ${error.message}`)
    process.exit(1)
  }
}

async function stopServer(signal) {
  console.log(`\nSe recibió ${signal}. Cerrando PixelVault API...`)

  if (server) {
    await new Promise((resolve) => server.close(resolve))
  }

  await mongoose.connection.close()
  process.exit(0)
}

process.on('SIGINT', () => stopServer('SIGINT'))
process.on('SIGTERM', () => stopServer('SIGTERM'))

startServer()
