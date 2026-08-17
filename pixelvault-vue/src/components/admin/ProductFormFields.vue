<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  platforms: {
    type: Array,
    default: () => [],
  },
  idPrefix: {
    type: String,
    default: 'product',
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const visibleStoredImages = computed(() => {
  const removedIds = new Set(props.modelValue.removeImageIds || [])
  return (props.modelValue.imageFiles || []).filter((image) => {
    return !removedIds.has(String(image.id))
  })
})

function updateField(field, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value,
  })
}

function updateSelectedImages(event) {
  updateField('newImages', Array.from(event.target.files || []))
}

function toggleStoredImage(imageId) {
  const normalizedId = String(imageId)
  const removedIds = new Set(props.modelValue.removeImageIds || [])

  if (removedIds.has(normalizedId)) {
    removedIds.delete(normalizedId)
  } else {
    removedIds.add(normalizedId)
  }

  updateField('removeImageIds', [...removedIds])
}
</script>

<template>
  <div class="row g-3">
    <div class="col-12 col-md-6">
      <label class="form-label" :for="idPrefix + '-name'">Nombre</label>
      <input
        :id="idPrefix + '-name'"
        class="form-control nes-input"
        type="text"
        :value="modelValue.name"
        minlength="2"
        maxlength="100"
        required
        @input="updateField('name', $event.target.value)"
      >
    </div>

    <div class="col-12 col-md-6">
      <label class="form-label" :for="idPrefix + '-price'">Precio</label>
      <input
        :id="idPrefix + '-price'"
        class="form-control nes-input"
        type="number"
        min="0"
        step="0.01"
        :value="modelValue.price"
        required
        @input="updateField('price', $event.target.value)"
      >
    </div>

    <div class="col-12 col-md-6">
      <label class="form-label" :for="idPrefix + '-platform'">Plataforma</label>
      <input
        :id="idPrefix + '-platform'"
        class="form-control nes-input"
        type="text"
        :list="idPrefix + '-platform-options'"
        :value="modelValue.platform"
        maxlength="60"
        required
        @input="updateField('platform', $event.target.value)"
      >

      <datalist :id="idPrefix + '-platform-options'">
        <option v-for="platform in platforms" :key="platform" :value="platform" />
      </datalist>
    </div>

    <div class="col-12 col-md-6">
      <label class="form-label" :for="idPrefix + '-category'">Categoría</label>
      <input
        :id="idPrefix + '-category'"
        class="form-control nes-input"
        type="text"
        :list="idPrefix + '-category-options'"
        :value="modelValue.category"
        maxlength="60"
        required
        @input="updateField('category', $event.target.value)"
      >

      <datalist :id="idPrefix + '-category-options'">
        <option v-for="category in categories" :key="category" :value="category" />
      </datalist>
    </div>

    <div class="col-12 col-md-6">
      <label class="form-label" :for="idPrefix + '-status'">Estado</label>
      <div class="nes-select">
        <select
          :id="idPrefix + '-status'"
          :value="String(modelValue.status !== false)"
          @change="updateField('status', $event.target.value === 'true')"
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>
    </div>

    <div class="col-12">
      <label class="form-label" :for="idPrefix + '-description'">Descripción</label>
      <textarea
        :id="idPrefix + '-description'"
        class="form-control nes-textarea"
        rows="4"
        :value="modelValue.description"
        maxlength="1000"
        required
        @input="updateField('description', $event.target.value)"
      />
    </div>

    <div class="col-12">
      <label class="form-label" :for="idPrefix + '-images'">Agregar imágenes</label>
      <input
        :id="idPrefix + '-images'"
        class="form-control nes-input"
        type="file"
        accept="image/*"
        multiple
        :aria-describedby="idPrefix + '-images-help'"
        @change="updateSelectedImages"
      >

      <p :id="idPrefix + '-images-help'" class="form-text mb-0">
        Puedes seleccionar hasta 8 imágenes. Cada archivo puede pesar como máximo 5 MB.
      </p>

      <ul v-if="modelValue.newImages?.length" class="selected-images mt-3 mb-0">
        <li v-for="image in modelValue.newImages" :key="image.name + image.size">
          {{ image.name }}
        </li>
      </ul>
    </div>

    <div v-if="modelValue.imageFiles?.length" class="col-12">
      <p class="form-label mb-2">Imágenes almacenadas en MongoDB</p>

      <div class="row g-3">
        <div v-for="image in modelValue.imageFiles" :key="image.id" class="col-6 col-lg-3">
          <article
            class="stored-image h-100 p-2"
            :class="{ 'stored-image--removed': modelValue.removeImageIds?.includes(String(image.id)) }"
          >
            <img :src="image.url" :alt="image.originalName" class="stored-image__preview mb-2">
            <p class="stored-image__name mb-2">{{ image.originalName }}</p>
            <button class="btn btn-sm w-100" type="button" @click="toggleStoredImage(image.id)">
              {{ visibleStoredImages.some((item) => item.id === image.id) ? 'Quitar' : 'Restaurar' }}
            </button>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-label,
.form-text,
.selected-images {
  font-size: 0.62rem;
  line-height: 1.6;
}

.form-control,
.nes-select select {
  border-radius: 0;
  font-family: inherit;
  font-size: 0.68rem;
}

.form-control:focus {
  border-color: #111;
  box-shadow: 0 0 0 0.25rem rgb(84 179 234 / 35%);
}

.stored-image {
  border: 3px solid #111;
  background-color: #fff;
}

.stored-image--removed {
  opacity: 0.5;
  background-color: #fdecea;
}

.stored-image__preview {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  background-color: #fff1d7;
}

.stored-image__name {
  overflow-wrap: anywhere;
  font-size: 0.48rem;
  line-height: 1.5;
}

.stored-image .btn {
  border: 2px solid #111;
  border-radius: 0;
  font-family: inherit;
  font-size: 0.5rem;
}
</style>
