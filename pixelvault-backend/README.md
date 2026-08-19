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

## Colecciones del modelo de datos

Además de `products`, la base de datos incluye las colecciones `categories`,
`users`, `orders` y `carts`, todas con operaciones CRUD completas.

### Categorías

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/categories` | Lista las categorías activas (`?includeInactive=true` las lista todas). |
| POST | `/api/categories` | Registra una categoría. |
| GET | `/api/categories/:id` | Obtiene una categoría. |
| PUT | `/api/categories/:id` | Edita una categoría. |
| DELETE | `/api/categories/:id` | Borrado lógico: establece `status=false`. |

### Usuarios

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/users` | Lista usuarios (nunca incluye la contraseña). |
| POST | `/api/users` | Registra un usuario; la contraseña se hashea con bcryptjs. |
| GET | `/api/users/:id` | Obtiene un usuario. |
| PUT | `/api/users/:id` | Edita el perfil (nombre, correo, direcciones, etc.); ignora `password`. |
| PATCH | `/api/users/:id/password` | Cambia la contraseña verificando la actual (`currentPassword` + `newPassword`). |
| DELETE | `/api/users/:id` | Borrado lógico: establece `status=false`. |

Cada usuario guarda `addresses` y `paymentMethods` como subdocumentos (misma
forma que `addresses.json` y `paymentMethods.json` del frontend, sin el campo
`id` porque MongoDB lo genera) y `favoriteProductIds` como referencias a
`products`.

### Órdenes

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/orders` | Lista órdenes (`?userId=<id>` filtra por usuario). |
| POST | `/api/orders` | Registra una orden; si faltan `subtotal`/`total`, se calculan desde los items. |
| GET | `/api/orders/:id` | Obtiene una orden. |
| PUT | `/api/orders/:id` | Actualiza `status` y los montos. |
| DELETE | `/api/orders/:id` | Borrado lógico: establece `status='cancelled'`. |

Los items guardan un snapshot del producto (`name`, `price`, `quantity`,
`platform`, `image`) con una referencia opcional a `products`, de modo que la
orden conserva su historia aunque el catálogo cambie.

### Carritos

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/carts` | Lista los carritos. |
| GET | `/api/carts/by-user/:userId` | Obtiene el carrito de un usuario. |
| POST | `/api/carts` | Upsert por usuario: crea el carrito (201) o fusiona items al existente (200). |
| PUT | `/api/carts/:id` | Reemplaza el contenido completo del carrito. |
| DELETE | `/api/carts/:id` | Borrado físico del carrito. |
| DELETE | `/api/carts/by-user/:userId` | Vacía el carrito del usuario conservando el documento. |

Hay un solo carrito por usuario (`user` es único); al agregar un producto que
ya estaba en el carrito se suman las cantidades.

## Datos de ejemplo (seed)

Para poblar categorías, usuarios, órdenes y carritos de ejemplo, ejecuta:

```bash
npm run seed
```

El script solo inserta cuando la colección está vacía (es idempotente) e
imprime un resumen con la cantidad de documentos insertados por colección.
Los usuarios de ejemplo usan la contraseña `Clave12345`:

- `usuario@example.com` (Andrés Westra Ureña, admin) — recibe 2 órdenes y un
  carrito de ejemplo.
- `jimena.montero@example.com` (Jimena Montero Segura, customer).
- `esteban.delgado@example.com` (Esteban Jesús Delgado González, customer).

Las órdenes referencian productos si la colección `products` ya tiene datos;
si no, se crean con snapshots sin referencia para que el seed nunca falle.

`addresses.json` y `paymentMethods.json` ya no quedan fuera del backend: ahora
viven como subdocumentos del modelo `User` (colección `users`).

## Decisiones importantes

- `timestamps: true` agrega `createdAt` y `updatedAt` automáticamente.
- `status` implementa el borrado lógico de productos.
- GridFS guarda los binarios dentro de MongoDB; el documento `Product` solo
  conserva referencias y metadatos.
- `strict: false` permite extender los documentos en el futuro, aunque los
  campos principales continúan teniendo validaciones explícitas.
- La API devuelve `id` como texto porque MongoDB utiliza `ObjectId` y no IDs
  numéricos.
