/**
 * Servicio de facturas (invoices) de PixelVault.
 *
 * Genera los PDF de facturas a través de la API externa de
 * invoice-generator.com:
 *
 *   POST https://invoice-generator.com
 *   Authorization: Bearer <INVOICE_GENERATOR_API_KEY>
 *   Content-Type: application/json
 *   Accept-Language: es-ES
 *
 * La llamada tiene un timeout de 15 segundos vía AbortSignal.timeout.
 * Los fallos del proveedor externo (red, timeout, respuesta no-ok, PDF
 * inválido) se propagan como errores con `statusCode` 502; el límite de
 * plan (HTTP 429) se propaga como 503.
 *
 * El body es un JSON con la estructura documentada en
 * https://invoice-generator.com/developers. La API responde con el PDF
 * binario, que este servicio devuelve como Buffer sin que el controller
 * cambie su contrato.
 */

const INVOICE_GENERATOR_ENDPOINT = 'https://invoice-generator.com'
const REQUEST_TIMEOUT_MS = 15000

/**
 * Datos de facturación del emisor (PixelVault) como líneas multilínea.
 * @type {string[]}
 */
const COMPANY_LINES = [
  'PixelVault',
  'San José, Costa Rica',
  'Avenida Central 123, Barrio La California',
  'Cédula Jurídica 3-101-123456',
  'facturacion@pixelvault.cr',
  '+506 2222-3344',
]

/**
 * Resuelve el número de factura de una orden: usa `invoiceNumber` si
 * existe; de lo contrario deriva uno del `_id` con prefijo "PV-".
 *
 * @param {Object} order
 * @returns {string}
 */
function resolveInvoiceNumber(order) {
  if (order && order.invoiceNumber) {
    return String(order.invoiceNumber)
  }

  const id = String(order && (order._id || order.id) || '')
  const suffix = (id.slice(-6) || '000000').toUpperCase()

  return `PV-${suffix}`
}

/**
 * Formatea la fecha de la factura en formato ISO-8601 (YYYY-MM-DD) para
 * que la API la parsee de forma inequívoca. La localización de las
 * etiquetas del PDF sigue en español vía el header `Accept-Language`.
 *
 * @param {Date|string|number} value
 * @returns {string}
 */
function formatInvoiceDate(value) {
  const date = value ? new Date(value) : new Date()

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10)
  }

  return date.toISOString().slice(0, 10)
}

/**
 * Líneas del bloque "to" (cliente): titular de la tarjeta y, si existe,
 * la dirección de envío.
 *
 * @param {Object} order
 * @returns {string[]}
 */
function clientLines(order) {
  const lines = []
  const cardholderName = order && order.payment && order.payment.cardholderName

  if (cardholderName) {
    lines.push(String(cardholderName))
  }

  const address = order && order.shippingAddress

  if (address && typeof address === 'object') {
    if (address.addressLine) {
      lines.push(String(address.addressLine))
    }

    const cityPart = [address.city, address.state].filter(Boolean).join(', ')

    if (cityPart) {
      lines.push(cityPart)
    }

    const countryPart = [address.zipCode, address.country].filter(Boolean).join(' ')

    if (countryPart) {
      lines.push(countryPart)
    }

    if (address.phone) {
      lines.push(`Tel: ${address.phone}`)
    }
  }

  if (lines.length === 0) {
    lines.push('Consumidor final')
  }

  return lines
}

/**
 * Líneas del bloque "ship_to" (dirección de envío) o cadena vacía si la
 * orden no tiene dirección de envío.
 *
 * @param {Object} order
 * @returns {string}
 */
function shippingAddressLines(order) {
  const address = order && order.shippingAddress

  if (!address || typeof address !== 'object') {
    return ''
  }

  const lines = []

  if (address.addressLine) {
    lines.push(String(address.addressLine))
  }

  const cityPart = [address.city, address.state].filter(Boolean).join(', ')

  if (cityPart) {
    lines.push(cityPart)
  }

  const countryPart = [address.zipCode, address.country].filter(Boolean).join(' ')

  if (countryPart) {
    lines.push(countryPart)
  }

  if (address.phone) {
    lines.push(`Tel: ${address.phone}`)
  }

  return lines.join('\n')
}

/**
 * Nota con el método de pago de la orden.
 *
 * @param {Object} order
 * @returns {string}
 */
function paymentNotes(order) {
  const payment = order && order.payment
  const brand = payment && payment.brand ? String(payment.brand) : 'tarjeta'
  const last4 = payment && payment.last4 ? String(payment.last4) : '****'

  return `Método de pago: Tarjeta ${brand} ****${last4}`
}

/**
 * Construye el body JSON para la API de invoice-generator.com a partir de
 * una orden. Los campos `shipping`, `discounts` y `ship_to` solo se
 * incluyen cuando correspondan.
 *
 * @param {Object} order
 * @returns {Object}
 */
function buildInvoicePayload(order) {
  const items = (Array.isArray(order && order.items) ? order.items : [])
    .map((item) => ({
      name: String(item && item.name || 'Producto'),
      quantity: Number(item && item.quantity) || 0,
      unit_cost: Number(item && item.price) || 0,
    }))

  const shippingCost = Number(order && order.shippingCost) || 0
  const discount = Number(order && order.discount) || 0

  const payload = {
    from: COMPANY_LINES.join('\n'),
    to: clientLines(order).join('\n'),
    number: resolveInvoiceNumber(order),
    currency: 'CRC',
    date: formatInvoiceDate(order && order.createdAt),
    items,
    fields: {},
    notes: paymentNotes(order),
  }

  const shipTo = shippingAddressLines(order)

  if (shipTo) {
    payload.ship_to = shipTo
  }

  if (shippingCost > 0) {
    payload.shipping = shippingCost
    payload.fields.shipping = true
  }

  if (discount > 0) {
    payload.discounts = discount
    payload.fields.discounts = true
  }

  return payload
}

/**
 * Genera el PDF de la factura de una orden llamando a invoice-generator.com
 * y lo devuelve como Buffer.
 *
 * @param {Object} order orden (documento de Mongoose u objeto plano)
 * @returns {Promise<Buffer>}
 */
async function generateInvoicePDF(order) {
  const apiKey = process.env.INVOICE_GENERATOR_API_KEY

  if (!apiKey) {
    // Error de configuración del propio servidor: 500.
    const error = new Error(
      'Falta la variable de entorno INVOICE_GENERATOR_API_KEY para generar facturas.',
    )
    error.statusCode = 500
    throw error
  }

  const payload = buildInvoicePayload(order)

  let response

  try {
    response = await fetch(INVOICE_GENERATOR_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'es-ES',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify(payload),
    })
  } catch (error) {
    // Fallos de red o timeout del proveedor externo: 502 (bad gateway).
    const isTimeout = error.name === 'TimeoutError' || error.name === 'AbortError'
    const message = isTimeout
      ? 'La llamada a invoice-generator.com excedió el tiempo de espera.'
      : `No se pudo contactar invoice-generator.com: ${error.message}`

    const wrapped = new Error(message, { cause: error })
    wrapped.statusCode = 502
    throw wrapped
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    const suffix = detail ? ` (${detail})` : ''

    const error = new Error(
      `invoice-generator.com respondió con estado ${response.status}${suffix}.`,
    )
    // Límite del plan (429): 503. Cualquier otro error del upstream: 502.
    error.statusCode = response.status === 429 ? 503 : 502
    throw error
  }

  const buffer = Buffer.from(await response.arrayBuffer())

  if (buffer.length === 0 || buffer.subarray(0, 4).toString('ascii') !== '%PDF') {
    const error = new Error(
      'invoice-generator.com no devolvió un PDF válido para la factura.',
    )
    error.statusCode = 502
    throw error
  }

  return buffer
}

module.exports = {
  generateInvoicePDF,
  resolveInvoiceNumber,
}