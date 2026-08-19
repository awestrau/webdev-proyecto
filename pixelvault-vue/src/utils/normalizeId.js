/**
 * Normaliza un registro de la API para garantizar que siempre tenga un campo
 * `id` (cadena). Algunos recursos (productos) llegan con `id`, mientras que
 * otros (usuarios, categorías, órdenes) llegan con `_id` de Mongo sin mapear.
 * Este helper evita depender del presenter del backend.
 */
export function withId(item) {
  if (!item || typeof item !== 'object') {
    return item
  }

  if (item.id !== undefined && item.id !== null) {
    return item
  }

  if (item._id !== undefined && item._id !== null) {
    return {
      ...item,
      id: String(item._id),
    }
  }

  return item
}
