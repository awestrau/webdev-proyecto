import {
  computed,
  ref,
  unref,
  watch,
} from 'vue'

const CART_STORAGE_KEY = 'pixelvault-cart'

function loadCart() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedCart = JSON.parse(
      window.localStorage.getItem(CART_STORAGE_KEY) ?? '[]',
    )

    if (!Array.isArray(storedCart)) {
      return []
    }

    /*
     * También reconoce temporalmente objetos antiguos que guardaban "id"
     * en lugar de "productId".
     */
    return storedCart
      .map((item) => ({
        productId: String(item.productId ?? item.id ?? '').trim(),
        quantity: Math.max(1, Number(item.quantity) || 1),
      }))
      .filter((item) => item.productId)
  } catch (error) {
    console.error('No se pudo leer el carrito:', error)
    return []
  }
}

const cartEntries = ref(loadCart())

watch(
  cartEntries,
  (newCart) => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(newCart),
    )
  },
  {
    deep: true,
  },
)

export function useCart(productsSource = []) {
  function getProducts() {
    const currentProducts = unref(productsSource)

    return Array.isArray(currentProducts)
      ? currentProducts
      : []
  }

  const cartItems = computed(() => {
    return cartEntries.value
      .map((entry) => {
        const product = getProducts().find((item) => {
          return String(item.id) === entry.productId
        })

        if (!product) {
          return null
        }

        return {
          ...product,
          quantity: entry.quantity,
        }
      })
      .filter(Boolean)
  })

  const totalUnits = computed(() => {
    return cartEntries.value.reduce((total, item) => {
      return total + item.quantity
    }, 0)
  })

  const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  })

  function addToCart(productId, quantity = 1) {
    const normalizedId = String(productId ?? '').trim()
    const normalizedQuantity = Math.max(1, Number(quantity) || 1)

    const productExists = getProducts().some((product) => {
      return String(product.id) === normalizedId
    })

    if (!productExists) {
      return false
    }

    const existingEntry = cartEntries.value.find((item) => {
      return item.productId === normalizedId
    })

    if (existingEntry) {
      existingEntry.quantity += normalizedQuantity
    } else {
      cartEntries.value.push({
        productId: normalizedId,
        quantity: normalizedQuantity,
      })
    }

    return true
  }

  function increaseQuantity(productId) {
    const entry = cartEntries.value.find((item) => {
      return item.productId === String(productId)
    })

    if (entry) {
      entry.quantity += 1
    }
  }

  function decreaseQuantity(productId) {
    const entry = cartEntries.value.find((item) => {
      return item.productId === String(productId)
    })

    if (entry && entry.quantity > 1) {
      entry.quantity -= 1
    }
  }

  function removeProduct(productId) {
    cartEntries.value = cartEntries.value.filter((item) => {
      return item.productId !== String(productId)
    })
  }

  function clearCart() {
    cartEntries.value = []
  }

  function isInCart(productId) {
    return cartEntries.value.some((item) => {
      return item.productId === String(productId)
    })
  }

  return {
    cartEntries,
    cartItems,
    totalUnits,
    subtotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeProduct,
    clearCart,
    isInCart,
  }
}
