const mongoose = require('mongoose')

async function connectDB() {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('La variable MONGO_URI no está configurada.')
  }

  const connection = await mongoose.connect(mongoUri, {
    dbName: process.env.MONGO_DB_NAME || 'pixelvault',
  })

  console.log(
    `MongoDB conectado a la base de datos ${connection.connection.name}.`,
  )

  return connection
}

module.exports = connectDB
