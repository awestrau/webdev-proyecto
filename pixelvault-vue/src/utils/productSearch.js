export const MAX_PRODUCT_SEARCH_LENGTH = 60

const ALLOWED_PRODUCT_SEARCH_CHARACTERS =
  /[^\p{L}\p{N}\s'’:&+.\-]/gu

export function sanitizeProductSearch(value) {
  const rawValue = String(value ?? '')
  const hasForbiddenCharacters =
    ALLOWED_PRODUCT_SEARCH_CHARACTERS.test(rawValue)

  ALLOWED_PRODUCT_SEARCH_CHARACTERS.lastIndex = 0

  const sanitizedValue = rawValue
    .replace(ALLOWED_PRODUCT_SEARCH_CHARACTERS, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, MAX_PRODUCT_SEARCH_LENGTH)

  let error = ''

  if (hasForbiddenCharacters) {
    error = 'La búsqueda contiene caracteres no permitidos.'
  } else if (rawValue.length > MAX_PRODUCT_SEARCH_LENGTH) {
    error =
      'La búsqueda no puede superar '
      + MAX_PRODUCT_SEARCH_LENGTH
      + ' caracteres.'
  }

  return {
    value: sanitizedValue,
    error,
  }
}

export function normalizeProductText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
    .trim()
}

export function productMatchesSearch(product, searchText) {
  const normalizedSearch = normalizeProductText(searchText)

  if (!normalizedSearch) {
    return true
  }

  const searchableContent = normalizeProductText([
    product.name,
    product.platform,
    product.category,
  ].join(' '))

  return searchableContent.includes(normalizedSearch)
}
