<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'
import {
  useRoute,
  useRouter,
} from 'vue-router'

import { useAuth } from '../composables/useAuth'

import '../assets/forms.css'

const route = useRoute()
const router = useRouter()

const { login } = useAuth()

// --- Estado del formulario ---
const correo = ref('')
const password = ref('')
const recordar = ref(false)

const correoTouched = ref(false)
const passwordTouched = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// --- Reglas de validación ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const correoError = computed(() => {
  if (!correoTouched.value) return ''
  if (!correo.value.trim()) return 'El correo electrónico es obligatorio.'
  if (!emailRegex.test(correo.value.trim())) return 'Ingresá un correo electrónico válido.'
  return ''
})

const passwordError = computed(() => {
  if (!passwordTouched.value) return ''
  if (!password.value) return 'La contraseña es obligatoria.'
  return ''
})

const isCorreoValid = computed(() => correoTouched.value && !correoError.value)
const isPasswordValid = computed(() => passwordTouched.value && !passwordError.value)

const isFormValid = computed(() => {
  return correo.value.trim() && emailRegex.test(correo.value.trim()) && password.value
})

// --- Handlers ---
async function handleSubmit() {
  // Al enviar marcamos todos los campos como touched para mostrar errores.
  correoTouched.value = true
  passwordTouched.value = true

  if (!isFormValid.value) {
    return
  }

  errorMessage.value = ''
  loading.value = true

  try {
    const user = await login(
      correo.value.trim(),
      password.value,
      { persist: recordar.value },
    )

    // Si vino de una página protegida (query redirect), respetamos el destino.
    const redirect = route.query.redirect

    const target = (
      typeof redirect === 'string'
      && redirect.startsWith('/')
      && redirect !== '/login'
    )
      ? redirect
      : (user.role === 'admin' ? '/admin-portal' : '/')

    router.replace(target)
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'No fue posible iniciar sesión.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.query.registrado) {
    successMessage.value =
      'Tu cuenta fue creada correctamente. Ya podés iniciar sesión.'
  }
})
</script>

<template>
  <section class="form-section">
    <div class="container">
      <div class="form-card">
        <div class="form-header">
          <h2>Iniciar Sesión</h2>

          <p>Ingresá a tu cuenta para continuar</p>
        </div>

        <div v-if="successMessage" class="form-alert form-alert--success" role="status" aria-live="polite">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="form-alert form-alert--danger" role="alert" aria-live="assertive">
          {{ errorMessage }}
        </div>

        <form novalidate @submit.prevent="handleSubmit">
          <div class="form-field">
            <label for="login-correo" class="form-label">Correo electrónico</label>

            <input id="login-correo" v-model="correo" type="email"
              class="form-control form-input"
              :class="{ 'is-invalid': correoError, 'is-valid': isCorreoValid }"
              placeholder="correo@ejemplo.com" autocomplete="email" aria-required="true"
              :aria-invalid="!!correoError"
              :aria-describedby="correoError ? 'login-correo-error' : undefined"
              @blur="correoTouched = true">

            <p v-if="correoError" id="login-correo-error" class="form-error" role="alert">
              {{ correoError }}
            </p>
          </div>

          <div class="form-field">
            <label for="login-password" class="form-label">Contraseña</label>

            <input id="login-password" v-model="password" type="password"
              class="form-control form-input"
              :class="{ 'is-invalid': passwordError, 'is-valid': isPasswordValid }"
              placeholder="Tu contraseña" autocomplete="current-password" aria-required="true"
              :aria-invalid="!!passwordError"
              :aria-describedby="passwordError ? 'login-password-error' : undefined"
              @blur="passwordTouched = true">

            <p v-if="passwordError" id="login-password-error" class="form-error" role="alert">
              {{ passwordError }}
            </p>
          </div>

          <div class="form-check">
            <input id="login-recordar" v-model="recordar" type="checkbox"
              class="form-check-input">

            <label for="login-recordar" class="form-check-label">Recordarme</label>
          </div>

          <button type="submit" class="form-submit" :disabled="loading">
            {{ loading ? 'Ingresando...' : 'Ingresar' }}
          </button>
        </form>

        <div class="form-footer">
          <p>
            ¿No tenés cuenta?

            <router-link to="/registro" class="form-link">
              Registrate aquí
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* No se requiere CSS adicional; todo está en forms.css. */
</style>
