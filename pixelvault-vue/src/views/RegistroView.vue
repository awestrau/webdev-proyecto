<script setup>
import { ref, computed } from 'vue'

import '../assets/forms.css'

// --- Estado del formulario ---
const nombre = ref('')
const apellido = ref('')
const correo = ref('')
const usuario = ref('')
const password = ref('')
const confirmar = ref('')
const terminos = ref(false)

const nombreTouched = ref(false)
const apellidoTouched = ref(false)
const correoTouched = ref(false)
const usuarioTouched = ref(false)
const passwordTouched = ref(false)
const confirmarTouched = ref(false)
const terminosTouched = ref(false)

// --- Reglas de validación ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const lettersAndSpacesRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
const usernameRegex = /^[a-zA-Z0-9_]+$/

const nombreError = computed(() => {
  if (!nombreTouched.value) return ''
  if (!nombre.value.trim()) return 'El nombre es obligatorio.'
  if (nombre.value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.'
  if (!lettersAndSpacesRegex.test(nombre.value.trim())) return 'El nombre solo puede contener letras y espacios.'
  return ''
})

const apellidoError = computed(() => {
  if (!apellidoTouched.value) return ''
  if (!apellido.value.trim()) return 'El apellido es obligatorio.'
  if (apellido.value.trim().length < 2) return 'El apellido debe tener al menos 2 caracteres.'
  if (!lettersAndSpacesRegex.test(apellido.value.trim())) return 'El apellido solo puede contener letras y espacios.'
  return ''
})

const correoError = computed(() => {
  if (!correoTouched.value) return ''
  if (!correo.value.trim()) return 'El correo electrónico es obligatorio.'
  if (!emailRegex.test(correo.value.trim())) return 'Ingresá un correo electrónico válido.'
  return ''
})

const usuarioError = computed(() => {
  if (!usuarioTouched.value) return ''
  if (!usuario.value.trim()) return 'El nombre de usuario es obligatorio.'
  if (usuario.value.trim().length < 3) return 'El usuario debe tener al menos 3 caracteres.'
  if (!usernameRegex.test(usuario.value.trim())) return 'El usuario solo puede contener letras, números y guiones bajos.'
  return ''
})

const passwordError = computed(() => {
  if (!passwordTouched.value) return ''
  if (!password.value) return 'La contraseña es obligatoria.'
  if (password.value.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  return ''
})

const confirmarError = computed(() => {
  if (!confirmarTouched.value) return ''
  if (!confirmar.value) return 'Debés repetir la contraseña.'
  if (confirmar.value !== password.value) return 'Las contraseñas no coinciden.'
  return ''
})

const terminosError = computed(() => {
  if (!terminosTouched.value) return ''
  if (!terminos.value) return 'Debés aceptar los términos y condiciones.'
  return ''
})

// Banderas de validez por campo (solo tras haber sido tocado)
const isNombreValid = computed(() => nombreTouched.value && !nombreError.value)
const isApellidoValid = computed(() => apellidoTouched.value && !apellidoError.value)
const isCorreoValid = computed(() => correoTouched.value && !correoError.value)
const isUsuarioValid = computed(() => usuarioTouched.value && !usuarioError.value)
const isPasswordValid = computed(() => passwordTouched.value && !passwordError.value)
const isConfirmarValid = computed(() => confirmarTouched.value && !confirmarError.value)
const isTerminosValid = computed(() => terminosTouched.value && !terminosError.value)

const isFormValid = computed(() => {
  return (
    nombre.value.trim().length >= 2 &&
    lettersAndSpacesRegex.test(nombre.value.trim()) &&
    apellido.value.trim().length >= 2 &&
    lettersAndSpacesRegex.test(apellido.value.trim()) &&
    emailRegex.test(correo.value.trim()) &&
    usuario.value.trim().length >= 3 &&
    usernameRegex.test(usuario.value.trim()) &&
    password.value.length >= 8 &&
    confirmar.value === password.value &&
    terminos.value
  )
})

// --- Handlers ---
function handleSubmit() {
  // Al enviar marcamos todos los campos como touched para mostrar errores.
  nombreTouched.value = true
  apellidoTouched.value = true
  correoTouched.value = true
  usuarioTouched.value = true
  passwordTouched.value = true
  confirmarTouched.value = true
  terminosTouched.value = true

  if (!isFormValid.value) {
    return
  }

  console.log('Registro enviado:', {
    nombre: nombre.value.trim(),
    apellido: apellido.value.trim(),
    correo: correo.value.trim(),
    usuario: usuario.value.trim(),
    password: password.value,
    terminos: terminos.value,
  })
}
</script>

<template>
  <section class="form-section">
    <div class="container">
      <div class="form-card form-card--registro">
        <div class="form-header">
          <h2>Crear Cuenta</h2>

          <p>Unite a la comunidad retro de PixelVault</p>
        </div>

        <form novalidate @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-field">
              <label for="registro-nombre" class="form-label">Nombre</label>

              <input id="registro-nombre" v-model="nombre" type="text"
                class="form-control form-input"
                :class="{ 'is-invalid': nombreError, 'is-valid': isNombreValid }"
                placeholder="Tu nombre" autocomplete="given-name" aria-required="true"
                :aria-invalid="!!nombreError"
                :aria-describedby="nombreError ? 'registro-nombre-error' : undefined"
                @blur="nombreTouched = true">

              <p v-if="nombreError" id="registro-nombre-error" class="form-error" role="alert">
                {{ nombreError }}
              </p>
            </div>

            <div class="form-field">
              <label for="registro-apellido" class="form-label">Apellido</label>

              <input id="registro-apellido" v-model="apellido" type="text"
                class="form-control form-input"
                :class="{ 'is-invalid': apellidoError, 'is-valid': isApellidoValid }"
                placeholder="Tu apellido" autocomplete="family-name" aria-required="true"
                :aria-invalid="!!apellidoError"
                :aria-describedby="apellidoError ? 'registro-apellido-error' : undefined"
                @blur="apellidoTouched = true">

              <p v-if="apellidoError" id="registro-apellido-error" class="form-error" role="alert">
                {{ apellidoError }}
              </p>
            </div>
          </div>

          <div class="form-field">
            <label for="registro-correo" class="form-label">Correo electrónico</label>

            <input id="registro-correo" v-model="correo" type="email"
              class="form-control form-input"
              :class="{ 'is-invalid': correoError, 'is-valid': isCorreoValid }"
              placeholder="correo@ejemplo.com" autocomplete="email" aria-required="true"
              :aria-invalid="!!correoError"
              :aria-describedby="correoError ? 'registro-correo-error' : undefined"
              @blur="correoTouched = true">

            <p v-if="correoError" id="registro-correo-error" class="form-error" role="alert">
              {{ correoError }}
            </p>
          </div>

          <div class="form-field">
            <label for="registro-usuario" class="form-label">Nombre de usuario</label>

            <input id="registro-usuario" v-model="usuario" type="text"
              class="form-control form-input"
              :class="{ 'is-invalid': usuarioError, 'is-valid': isUsuarioValid }"
              placeholder="Elegí un nombre de usuario" autocomplete="username" aria-required="true"
              :aria-invalid="!!usuarioError"
              :aria-describedby="usuarioError ? 'registro-usuario-error' : undefined"
              @blur="usuarioTouched = true">

            <p v-if="usuarioError" id="registro-usuario-error" class="form-error" role="alert">
              {{ usuarioError }}
            </p>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label for="registro-password" class="form-label">Contraseña</label>

              <input id="registro-password" v-model="password" type="password"
                class="form-control form-input"
                :class="{ 'is-invalid': passwordError, 'is-valid': isPasswordValid }"
                placeholder="Mínimo 8 caracteres" autocomplete="new-password" aria-required="true"
                :aria-invalid="!!passwordError"
                :aria-describedby="passwordError ? 'registro-password-error' : undefined"
                @blur="passwordTouched = true">

              <p v-if="passwordError" id="registro-password-error" class="form-error" role="alert">
                {{ passwordError }}
              </p>
            </div>

            <div class="form-field">
              <label for="registro-confirmar" class="form-label">Confirmar Contraseña</label>

              <input id="registro-confirmar" v-model="confirmar" type="password"
                class="form-control form-input"
                :class="{ 'is-invalid': confirmarError, 'is-valid': isConfirmarValid }"
                placeholder="Repetí tu contraseña" autocomplete="new-password" aria-required="true"
                :aria-invalid="!!confirmarError"
                :aria-describedby="confirmarError ? 'registro-confirmar-error' : undefined"
                @blur="confirmarTouched = true">

              <p v-if="confirmarError" id="registro-confirmar-error" class="form-error" role="alert">
                {{ confirmarError }}
              </p>
            </div>
          </div>

          <div class="form-check" :class="{ 'is-invalid': terminosTouched && !isTerminosValid }">
            <input id="registro-terminos" v-model="terminos" type="checkbox"
              class="form-check-input" aria-required="true" :aria-invalid="!!terminosError"
              :aria-describedby="terminosError ? 'registro-terminos-error' : undefined"
              @blur="terminosTouched = true">

            <label for="registro-terminos" class="form-check-label">
              Acepto los términos y condiciones
            </label>
          </div>

          <p v-if="terminosError" id="registro-terminos-error" class="form-error" role="alert">
            {{ terminosError }}
          </p>

          <button type="submit" class="form-submit">
            Crear Cuenta
          </button>
        </form>

        <div class="form-footer">
          <p>
            ¿Ya tenés cuenta?

            <router-link to="/login" class="form-link">
              Iniciá sesión
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* El formulario de registro necesita más ancho que el de login
   (max-width: 520px de forms.css) para que quepan los placeholders. */
.form-card--registro {
  max-width: 640px;
}
</style>
