# PixelVault Frontend

![logo](src/assets/images/logo.jpg)

Aplicación web de PixelVault, desarrollada con **Vue 3 + Vite** (puerto 5173).

> **Acerca del proyecto:** PixelVault es una tienda en línea de videojuegos y
> consolas retro (Programación Web Avanzada — SOFT 12, Universidad CENFOTEC).
> La misión, visión, valores, los integrantes y la guía de ejecución del
> proyecto completo están en el [README principal](../README.md).

## Ejecución del proyecto

La aplicación web está desarrollada con **Vue 3 + Vite** y se encuentra en la
carpeta [`pixelvault-vue/`](./pixelvault-vue). Es el frontend de PixelVault y
**requiere que el backend** (`pixelvault-backend/`, puerto 3000) **esté
corriendo** para consumir la API en `http://localhost:3000/api`. Consultá el
[README del backend](../pixelvault-backend/README.md) para su configuración.

### Requisitos

- **Node.js** `^22.18.0` o `>=24.12.0`
- **npm** (incluido con Node.js)
- El backend de PixelVault ejecutándose en el puerto 3000.

### Clonación del repositorio

Con HTTPS:

```sh
git clone https://github.com/awestrau/webdev-proyecto.git
cd webdev-proyecto/pixelvault-vue
```

Con SSH:

```sh
git clone git@github.com:awestrau/webdev-proyecto.git
cd webdev-proyecto/pixelvault-vue
```

### Configuración del entorno (`.env`)

El archivo `.env` se entrega **ya creado y configurado** con
`VITE_API_URL=http://localhost:3000/api`, que indica dónde se encuentra la API
del backend.

> Si el archivo faltara (por ejemplo, al clonar el repositorio desde cero),
> crealo a partir de la plantilla incluida:
>
> ```sh
> cp .env.example .env
> ```
>
> El único valor requerido es `VITE_API_URL=http://localhost:3000/api`. Si el
> backend corre en otro puerto u host, ajustá este valor.

### Instalación de dependencias

```sh
npm install
```

### Servidor de desarrollo (con recarga en caliente)

```sh
npm run dev
```

Se levanta en <http://localhost:5173>.

### Compilación para producción

```sh
npm run build
```

El resultado se genera en `pixelvault-vue/dist/`.

### Vista previa de la compilación

```sh
npm run preview
```

## Panel de administración

La ruta **`/admin-portal`** contiene el panel de administración de PixelVault.
Es una **ruta protegida**: requiere una sesión iniciada con rol `admin`; un
visitante sin sesión es redirigido a `/login` y un usuario con sesión pero sin
rol `admin` a la página principal. Solo los administradores pueden verlo y
usarlo.

Credenciales de verificación (académicas, mock):

| Campo | Valor |
|---|---|
| Correo | `admin@pixelvault.com` |
| Contraseña | `admin1234` |

> **Nota:** la base de datos entregada ya viene cargada con este usuario (rol
> `admin`); no es necesario ejecutar el seed del backend. Es una credencial
> para que el docente pueda verificar el panel; no corresponde a un usuario de
> producción.

Desde el panel se gestionan **Productos, Usuarios, Categorías y Órdenes**
(registro, edición y activación/desactivación de productos, gestión de
categorías, cambio de estado de órdenes, etc.). Además, solo el admin puede
crear otros administradores desde la sección Usuarios.

### Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Landing page |
| `/products` | Catálogo de productos |
| `/producto/:id` | Detalle de un producto |
| `/login` y `/registro` | Iniciar sesión y crear cuenta |
| `/mi_carrito` | Carrito de compras (incluye checkout y pago) |
| `/guardados` | Productos guardados en favoritos |
| `/admin-portal` | Panel de administración (solo rol `admin`) |
