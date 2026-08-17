# PixelVault Backend

API REST independiente para el proyecto PixelVault. Sigue la misma idea del
proyecto universitario `cursos-api`, pero separa rutas, controladores, modelos,
servicios y middleware para que cada archivo tenga una responsabilidad clara.

## Requisitos

- Node.js 22.18 o superior.
- Una conexión válida de MongoDB Atlas en `MONGO_URI`.
- El frontend `pixelvault-vue` ejecutándose en otro proceso.

## Configuración

1. Copia `.env.example` como `.env`.
2. Configura `MONGO_URI`.
3. Conserva `MONGO_DB_NAME=pixelvault` para usar esa base de datos.
4. Ejecuta `npm install`.
5. Ejecuta `npm run dev`.

La API queda disponible por defecto en `http://localhost:3000`.

## Endpoints de productos

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/products` | Lista únicamente productos activos. |
| GET | `/api/products?includeInactive=true` | Lista todo el inventario administrativo. |
| GET | `/api/products/:id` | Obtiene un producto activo. |
| POST | `/api/products` | Registra un producto mediante `multipart/form-data`. |
| PUT | `/api/products/:id` | Edita datos y agrega o elimina imágenes. |
| PATCH | `/api/products/:id/status` | Activa o desactiva un producto. |
| DELETE | `/api/products/:id` | Borrado lógico: establece `status=false`. |
| GET | `/api/products/images/:imageId` | Entrega una imagen almacenada en GridFS. |

Los archivos se envían con el campo multipart `images`. Se aceptan hasta ocho
imágenes de 5 MB cada una. Para eliminar imágenes durante una edición se envía
`removeImageIds` como un arreglo JSON de identificadores.

## Otras colecciones preparadas

También se incluyen modelos y CRUD básico para:

- `/api/promotion-codes`
- `/api/shipping-options`

`addresses.json` y `paymentMethods.json` permanecen fuera del backend hasta
definir el modelo de usuarios y sus relaciones.

## Decisiones importantes

- `timestamps: true` agrega `createdAt` y `updatedAt` automáticamente.
- `status` implementa el borrado lógico de productos.
- GridFS guarda los binarios dentro de MongoDB; el documento `Product` solo
  conserva referencias y metadatos.
- `strict: false` permite extender los documentos en el futuro, aunque los
  campos principales continúan teniendo validaciones explícitas.
- La API devuelve `id` como texto porque MongoDB utiliza `ObjectId` y no IDs
  numéricos.
