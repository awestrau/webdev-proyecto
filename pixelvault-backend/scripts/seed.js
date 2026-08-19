/* eslint-disable no-console */
// El .env con MONGO_URI/JWT_SECRET vive en la RAÍZ del repo (/admin/.env);
// desde scripts/ se resuelve con ../../.env (no depende del cwd).
require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env'),
})

const connectDB = require('../src/config/db')
const mongoose = require('mongoose')
const Cart = require('../src/models/Cart.model')
const Category = require('../src/models/Category.model')
const Order = require('../src/models/Order.model')
const Product = require('../src/models/Product.model')
const User = require('../src/models/User.model')

const PASSWORD = 'Clave12345'

const categoriesSeed = [
  {
    name: 'Consolas',
    slug: 'consolas',
    description: 'Consolas de sobremesa modernas y reacondicionadas.',
  },
  {
    name: 'Juegos',
    slug: 'juegos',
    description: 'Videojuegos físicos para todas las plataformas.',
  },
  {
    name: 'Accesorios',
    slug: 'accesorios',
    description: 'Controles, cables y accesorios para tus consolas.',
  },
  {
    name: 'Consolas Portátiles',
    slug: 'consolas-portatiles',
    description: 'Consolas portátiles para jugar donde quieras.',
  },
  {
    name: 'Merchandising',
    slug: 'merchandising',
    description: 'Coleccionables y artículos de la cultura retro.',
  },
]

const productsSeed = [
  {
    name: 'PlayStation 5 Slim',
    price: 260000,
    platform: 'PlayStation 5',
    category: 'Consolas',
    description: 'Consola PlayStation 5 Slim con almacenamiento SSD, control DualSense y compatibilidad con juegos físicos y digitales.',
  },
  {
    name: 'Nintendo Switch OLED',
    price: 180000,
    platform: 'Nintendo Switch',
    category: 'Consolas',
    description: 'Nintendo Switch con pantalla OLED, almacenamiento interno de 64 GB y base con puerto LAN.',
  },
  {
    name: 'Marvel\'s Spider-Man 2',
    price: 36000,
    platform: 'PlayStation 5',
    category: 'Juegos',
    description: 'Videojuego de acción y aventura para PlayStation 5 con Peter Parker y Miles Morales.',
  },
  {
    name: 'The Legend of Zelda: Tears of the Kingdom',
    price: 36000,
    platform: 'Nintendo Switch',
    category: 'Juegos',
    description: 'Explora las tierras y los cielos de Hyrule en una aventura de mundo abierto para Nintendo Switch.',
  },
  {
    name: 'Forza Horizon 5',
    price: 31000,
    platform: 'Xbox Series',
    category: 'Juegos',
    description: 'Videojuego de carreras de mundo abierto ambientado en diferentes regiones de México.',
  },
  {
    name: 'Control inalámbrico DualSense',
    price: 39000,
    platform: 'PlayStation 5',
    category: 'Accesorios',
    description: 'Control inalámbrico con respuesta háptica, gatillos adaptativos y micrófono integrado.',
  },
]

const addressSamples = [
  {
    label: 'Dirección 1',
    country: 'Costa Rica',
    phone: '8888-1111',
    addressLine: 'Barrio Escalante, 100 metros norte del parque',
    city: 'San José',
    state: 'San José',
    zipCode: '10101',
  },
  {
    label: 'Dirección 2',
    country: 'Costa Rica',
    phone: '8888-2222',
    addressLine: 'Residencial Los Robles, casa 25',
    city: 'Heredia',
    state: 'Heredia',
    zipCode: '40101',
  },
  {
    label: 'Dirección 3',
    country: 'Costa Rica',
    phone: '8888-3333',
    addressLine: 'Condominio Vista Verde, apartamento 8',
    city: 'Cartago',
    state: 'Cartago',
    zipCode: '30101',
  },
]

const paymentSample = {
  brand: 'Mastercard',
  last4: '9897',
  expiry: '03/2028',
}

function usersSeed() {
  return [
    {
      name: 'Andrés Westra Ureña',
      email: 'usuario@example.com',
      password: PASSWORD,
      role: 'admin',
      addresses: addressSamples,
      paymentMethods: addressSamples.map((_, index) => ({
        ...paymentSample,
        last4: ['9897', '5322', '0254'][index],
        cardholderName: 'Andrés Westra Ureña',
        expiry: index === 2 ? '08/2028' : '03/2028',
      })),
      favoriteProductIds: [],
    },
    {
      name: 'Jimena Montero Segura',
      email: 'jimena.montero@example.com',
      password: PASSWORD,
      role: 'customer',
      addresses: [addressSamples[1]],
      paymentMethods: [{
        brand: 'Visa',
        last4: '5322',
        cardholderName: 'Jimena Montero Segura',
        expiry: '03/2028',
      }],
      favoriteProductIds: [],
    },
    {
      name: 'Esteban Jesús Delgado González',
      email: 'esteban.delgado@example.com',
      password: PASSWORD,
      role: 'customer',
      addresses: [addressSamples[2]],
      paymentMethods: [{
        brand: 'Mastercard',
        last4: '0254',
        cardholderName: 'Esteban Jesús Delgado González',
        expiry: '08/2028',
      }],
      favoriteProductIds: [],
    },
  ]
}

const snapshotFallback = [
  { name: 'PlayStation 5 Slim', price: 260000, platform: 'PlayStation 5' },
  { name: 'Marvel\'s Spider-Man 2', price: 36000, platform: 'PlayStation 5' },
  { name: 'Control inalámbrico DualSense', price: 39000, platform: 'PlayStation 5' },
]

function buildOrderItems(products) {
  const source = products.length > 0 ? products : []

  const items = snapshotFallback.map((fallback, index) => {
    const product = source[index]

    return {
      ...(product ? { product: product._id } : {}),
      name: product ? product.name : fallback.name,
      price: product ? product.price : fallback.price,
      quantity: 1,
      platform: product ? product.platform : fallback.platform,
      image: product?.images?.[0]?.filename,
    }
  })

  return items.slice(0, 3)
}

function computeOrderAmounts(items, shippingCost, discount) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + shippingCost - discount
  return { discount, shippingCost, subtotal, total }
}

async function seedCollection(name, model, documents) {
  const count = await model.estimatedDocumentCount()

  if (count > 0) {
    console.log(`  - ${name}: ya tenía ${count} documento(s), se omite.`)
    return 0
  }

  if (documents.length === 0) {
    console.log(`  - ${name}: sin datos para sembrar, se omite.`)
    return 0
  }

  const created = await model.insertMany(documents)
  console.log(`  - ${name}: ${created.length} documento(s) insertado(s).`)
  return created.length
}

async function seedUsers() {
  const count = await User.estimatedDocumentCount()

  if (count > 0) {
    console.log(`  - users: ya tenía ${count} documento(s), se omite.`)
    return 0
  }

  const created = await User.create(usersSeed())
  console.log(`  - users: ${created.length} documento(s) insertado(s).`)
  return created.length
}

const ADMIN_EMAIL = 'admin@pixelvault.com'
const ADMIN_PASSWORD = 'admin1234'

async function ensureAdmin() {
  const existing = await User.findOne({ email: ADMIN_EMAIL })

  if (existing) {
    await User.updateOne(
      { _id: existing._id },
      { $set: { name: 'Administrador PixelVault', role: 'admin', status: true } },
    )
    console.log('  - admin: ya existía, se actualizó nombre/rol (contraseña intacta).')
    return 0
  }

  // User.create dispara el pre('save') que hashea la contraseña con bcrypt.
  await User.create({
    name: 'Administrador PixelVault',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
  })
  console.log('  - admin: administrador creado (admin@pixelvault.com).')
  return 1
}

async function seed() {
  await connectDB()

  const summary = {}

  console.log('\nSembrando categorías...')
  summary.categories = await seedCollection('categories', Category, categoriesSeed)

  console.log('\nSembrando usuarios...')
  summary.users = await seedUsers()

  console.log('\nGarantizando administrador...')
  summary.admin = await ensureAdmin()

  console.log('\nSembrando productos...')
  summary.products = await seedCollection('products', Product, productsSeed)

  const users = await User.find().sort({ createdAt: 1 })
  const firstUser = users[0]

  if (!firstUser) {
    console.log('\nNo hay usuarios: no se pueden sembrar órdenes ni carrito.')
  } else {
    const products = await Product.find().sort({ createdAt: 1 }).limit(3)

    console.log('\nSembrando órdenes...')
    const orderItems = buildOrderItems(products)
    const orderAmounts = computeOrderAmounts(orderItems, 2500, 0)
    const ordersSeed = [
      {
        user: firstUser._id,
        items: orderItems,
        shipping: { label: 'Envío normal', cost: 2500 },
        payment: {
          brand: 'Mastercard',
          last4: '9897',
          cardholderName: 'Andrés Westra Ureña',
          expiry: '03/2028',
        },
        promotionCode: { code: 'RETRO10', type: 'percentage', value: 10 },
        ...orderAmounts,
        status: 'paid',
      },
      {
        user: firstUser._id,
        items: orderItems.slice(0, 2).map((item) => ({ ...item, quantity: 2 })),
        shipping: { label: 'Envío rápido', cost: 7500 },
        payment: {
          brand: 'Visa',
          last4: '5322',
          cardholderName: 'Andrés Westra Ureña',
          expiry: '03/2028',
        },
        ...computeOrderAmounts(
          orderItems.slice(0, 2).map((item) => ({ ...item, quantity: 2 })),
          7500,
          0,
        ),
        status: 'pending',
      },
    ]
    summary.orders = await seedCollection('orders', Order, ordersSeed)

    console.log('\nSembrando carrito...')
    const cartItems = products.length > 0
      ? products.map((product, index) => ({
        product: product._id,
        quantity: index + 1,
      }))
      : []

    if (cartItems.length > 0) {
      summary.carts = await seedCollection('carts', Cart, [{
        user: firstUser._id,
        items: cartItems,
      }])
    } else {
      console.log('  - carts: no hay productos para el carrito de ejemplo, se omite.')
      summary.carts = 0
    }
  }

  console.log('\nResumen del seed:')
  for (const [collection, inserted] of Object.entries(summary)) {
    console.log(`  - ${collection}: ${inserted} documento(s) insertado(s).`)
  }
}

seed()
  .catch((error) => {
    console.error('\nEl seed falló:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.connection.close()
    console.log('Conexión con MongoDB cerrada.')
  })