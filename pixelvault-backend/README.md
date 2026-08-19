# PixelVault Backend

API REST independiente para el proyecto PixelVault. Sigue la misma idea del
proyecto universitario `cursos-api`, pero separa rutas, controladores, modelos,
servicios y middleware para que cada archivo tenga una responsabilidad clara.

## Requisitos

- Node.js `^22.18.0` o `>=24.12.0`.
- Una conexión válida de MongoDB Atlas en `MONGO_URI`.
- El frontend `pixelvault-vue` ejecutándose en otro proceso.

## Configuración

El servidor (`src/server.js`) lee las variables
de entorno desde un único archivo `.env` ubicado en la **raíz del repositorio**
(junto a `README.md`), resuelto como `../../.env` desde sus carpetas.

El repositorio se entrega con el `.env` **ya configurado** (`MONGO_URI` de
MongoDB Atlas y `JWT_SECRET`), por lo que para levantar el backend solo hace
falta:

1. Ejecutá `npm install`.
2. Ejecutá `npm run dev`.

La API queda disponible por defecto en `http://localhost:3000`.

> Si el archivo `.env` faltara (por ejemplo, al clonar el repositorio desde
> cero), recrealo copiando la plantilla:
>
> ```bash
> cp pixelvault-backend/.env.example .env
> ```
>
> y configurá las variables:
>
> - `MONGO_URI`: la cadena de conexión de **MongoDB Atlas**, que se obtiene
>   desde el cluster en Atlas Cloud (copiala seleccionando el driver "Node.js").
> - `JWT_SECRET`: secreto con el que se firman los tokens JWT (algoritmo HS256).
>   Sin este valor, la autenticación no funciona.
> - Conservá `MONGO_DB_NAME=pixelvault` para usar esa base de datos.

Otras variables opcionales del `.env`: `PORT`, `CLIENT_ORIGINS`,
`MAX_IMAGE_SIZE_MB` y `JWT_EXPIRES` (vigencia del token, por defecto `1d`).

## Autenticación

La API autentica con tokens JWT firmados con `JWT_SECRET` (HS256). Los
endpoints protegidos reciben el token en el encabezado:

```
Authorization: Bearer <token>
```

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/auth/login` | Recibe `{ email, password }` y devuelve `{ token, user }`. |
| GET | `/api/auth/me` | Devuelve el usuario correspondiente al token (requiere sesión). |

### Usuario administrador de verificación

| Campo | Valor |
|---|---|
| Correo | `admin@pixelvault.com` |
| Contraseña | `admin1234` |
| Rol | `admin` |

Se trata de una **credencial de verificación académica** (mock) para que el
docente pueda revisar el panel de administración del frontend. La base de datos
entregada ya viene cargada con este usuario (rol `admin`). No corresponde a un
usuario de producción.

El registro público (`POST /api/users`) siempre crea usuarios con rol
`customer` (se ignora cualquier rol enviado en el body). `POST /api/users/admin`
solo puede invocarlo un usuario admin y crea otros administradores.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor con recarga automática (`node --watch`). |
| `npm start` | Inicia el servidor sin recarga. |
| `npm run check` | Verifica la sintaxis de todos los archivos JavaScript. |

## Endpoints de productos

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/products` | Lista únicamente productos activos (público). |
| GET | `/api/products?includeInactive=true` | Lista todo el inventario administrativo (público). |
| GET | `/api/products/:id` | Obtiene un producto activo; `?includeInactive=true` lo obtiene aunque esté inactivo (público). |
| POST | `/api/products` | Registra un producto mediante `multipart/form-data` (solo admin). |
| PUT | `/api/products/:id` | Edita datos y agrega o elimina imágenes (solo admin). |
| PATCH | `/api/products/:id/status` | Activa o desactiva un producto (solo admin). |
| DELETE | `/api/products/:id` | Borrado lógico: establece `status=false` (solo admin). |
| GET | `/api/products/images/:imageId` | Entrega una imagen almacenada en GridFS (público). |

Los archivos se envían con el campo multipart `images`. Se aceptan hasta ocho
imágenes de 5 MB cada una. Para eliminar imágenes durante una edición se envía
`removeImageIds` como un arreglo JSON de identificadores.

## Otras colecciones preparadas

También se incluyen modelos y CRUD básico para:

### Códigos de promoción

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/promotion-codes` | Lista los códigos (público). |
| GET | `/api/promotion-codes/:id` | Obtiene un código (público). |
| POST | `/api/promotion-codes` | Registra un código (solo admin). |
| PUT | `/api/promotion-codes/:id` | Edita un código (solo admin). |
| DELETE | `/api/promotion-codes/:id` | Elimina un código (solo admin). |

### Opciones de envío

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/shipping-options` | Lista las opciones (público). |
| GET | `/api/shipping-options/:id` | Obtiene una opción (público). |
| POST | `/api/shipping-options` | Registra una opción (solo admin). |
| PUT | `/api/shipping-options/:id` | Edita una opción (solo admin). |
| DELETE | `/api/shipping-options/:id` | Elimina una opción (solo admin). |

## Colecciones del modelo de datos

Además de `products`, la base de datos incluye las colecciones `categories`,
`users`, `orders` y `carts`, todas con operaciones CRUD completas.

### Categorías

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/categories` | Lista las categorías activas; `?includeInactive=true` las lista todas (público). |
| POST | `/api/categories` | Registra una categoría (solo admin). |
| GET | `/api/categories/:id` | Obtiene una categoría (solo admin). |
| PUT | `/api/categories/:id` | Edita una categoría (solo admin). |
| DELETE | `/api/categories/:id` | Borrado lógico: establece `status=false` (solo admin). |

### Usuarios

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/users` | Lista usuarios; nunca incluye la contraseña (solo admin). |
| POST | `/api/users` | Registro público: siempre crea rol `customer`; la contraseña se hashea con bcryptjs. |
| POST | `/api/users/admin` | Crea un administrador (solo admin). |
| GET | `/api/users/:id` | Obtiene un usuario (solo admin). |
| PUT | `/api/users/:id` | Edita el perfil (nombre, correo, direcciones, etc.); ignora `password` (solo admin). |
| PATCH | `/api/users/:id/password` | Cambia la contraseña verificando la actual (`currentPassword` + `newPassword`) (solo admin). |
| DELETE | `/api/users/:id` | Borrado lógico: establece `status=false` (solo admin). |

Cada usuario guarda `addresses` y `paymentMethods` como subdocumentos (misma
forma que `addresses.json` y `paymentMethods.json` del frontend, sin el campo
`id` porque MongoDB lo genera) y `favoriteProductIds` como referencias a
`products`.

### Órdenes

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/orders` | Lista órdenes; `?userId=<id>` filtra por usuario (solo admin). |
| POST | `/api/orders` | Crea una orden (requiere sesión): el dueño es siempre el usuario del token; nombre, precio y plataforma de cada ítem se toman del catálogo en la BD y los montos (`subtotal`, `shippingCost`, `total`) se calculan en el servidor. |
| GET | `/api/orders/:id` | Obtiene una orden (solo admin). |
| PUT | `/api/orders/:id` | Actualiza `status` y los montos (solo admin). |
| DELETE | `/api/orders/:id` | Borrado lógico: establece `status='cancelled'` (solo admin). |

Los items guardan un snapshot del producto (`name`, `price`, `quantity`,
`platform`, `image`) con una referencia opcional a `products`, de modo que la
orden conserva su historia aunque el catálogo cambie. Al crearse, la orden
siempre queda en `status='pending'` (el cliente no puede forzar otro estado) y
el envío se valida contra la colección `shippingOptions`.

### Carritos

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/carts` | Lista los carritos (solo admin). |
| GET | `/api/carts/:id` | Obtiene un carrito (solo admin). |
| GET | `/api/carts/by-user/:userId` | Obtiene el carrito de un usuario (solo admin). |
| POST | `/api/carts` | Upsert (requiere sesión): crea el carrito (201) o fusiona items al existente (200), siempre sobre el usuario del token. |
| PUT | `/api/carts/:id` | Reemplaza el contenido completo del carrito (requiere sesión: solo el dueño). |
| DELETE | `/api/carts/:id` | Borrado físico del carrito (solo admin). |
| DELETE | `/api/carts/by-user/:userId` | Vacía el carrito del usuario conservando el documento (solo admin). |

Hay un solo carrito por usuario (`user` es único); al agregar un producto que
ya estaba en el carrito se suman las cantidades.

## Decisiones importantes

- `timestamps: true` agrega `createdAt` y `updatedAt` automáticamente.
- `status` implementa el borrado lógico de productos.
- GridFS guarda los binarios dentro de MongoDB; el documento `Product` solo
  conserva referencias y metadatos.
- `strict: false` permite extender los documentos en el futuro, aunque los
  campos principales continúan teniendo validaciones explícitas.
- La API devuelve `id` como texto porque MongoDB utiliza `ObjectId` y no IDs
  numéricos.
- Los tokens JWT se firman con `JWT_SECRET` (HS256) e incluyen `id` y `role`
  del usuario; `requireAuth` valida el token y `requireAdmin` además exige
  rol `admin` y `status=true`.
