import {
  computed,
  readonly,
  ref,
} from 'vue'

import {
  createAdminUser as createAdminUserRequest,
  deactivateUser as deactivateUserRequest,
  getUsers,
} from '../services/api'

import { withId } from '../utils/normalizeId'

// --- Estado a nivel de módulo (patrón de useProducts) ---
const users = ref([])
const loadingUsers = ref(false)
const usersError = ref('')
const usersLoaded = ref(false)

let loadingRequest = null

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : 'No fue posible completar la operación con usuarios.'
}

function replaceUser(updatedUser) {
  const index = users.value.findIndex((user) => {
    return String(user.id) === String(updatedUser.id)
  })

  if (index === -1) {
    users.value.unshift(updatedUser)
    return
  }

  users.value[index] = updatedUser
}

async function loadUsers({ force = false } = {}) {
  if (usersLoaded.value && !force) {
    return users.value
  }

  if (loadingRequest && !force) {
    return loadingRequest
  }

  loadingUsers.value = true
  usersError.value = ''

  loadingRequest = getUsers()
    .then((data) => {
      users.value = (data.users || []).map(withId)
      usersLoaded.value = true
      return users.value
    })
    .catch((error) => {
      usersError.value = getErrorMessage(error)
      throw error
    })
    .finally(() => {
      loadingUsers.value = false
      loadingRequest = null
    })

  return loadingRequest
}

async function createAdminUser(userData) {
  usersError.value = ''

  try {
    const data = await createAdminUserRequest(userData)

    if (data.user) {
      users.value.unshift(withId(data.user))
    }

    return data.user
  } catch (error) {
    usersError.value = getErrorMessage(error)
    throw error
  }
}

async function deactivateUser(userId) {
  usersError.value = ''

  try {
    const data = await deactivateUserRequest(userId)

    if (data.user) {
      replaceUser(withId(data.user))
    }

    return data.user
  } catch (error) {
    usersError.value = getErrorMessage(error)
    throw error
  }
}

function clearUsersError() {
  usersError.value = ''
}

export function useUsers() {
  const activeUsers = computed(() => {
    return users.value.filter((user) => user.status !== false)
  })

  return {
    users: readonly(users),
    activeUsers,
    loadingUsers: readonly(loadingUsers),
    usersError: readonly(usersError),
    usersLoaded: readonly(usersLoaded),
    loadUsers,
    createAdminUser,
    deactivateUser,
    clearUsersError,
  }
}
