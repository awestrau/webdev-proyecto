/**
 * Formatea un valor numérico como colones costarricenses (CRC).
 *
 * Ejemplo: formatCurrency(45000) => "₡45.000"
 */
const crcFormatter = new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})

export function formatCurrency(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
        return crcFormatter.format(0)
    }

    return crcFormatter.format(value)
}

export default formatCurrency
