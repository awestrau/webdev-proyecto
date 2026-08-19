# PixelVault

![logo](./doc/logo.jpg)

**Universidad CENFOTEC**
**Escuela de Ingeniería de Software**  
**Curso:** Programación Web Avanzada (SOFT 12)  
**Sección:** SCV1  
**Periodo:** C2-2026  
**Docente facilitador:** Pablo Monestel Gamboa

**Integrantes:**
- Andrés Westra Ureña
- Jimena Montero Segura
- Esteban Jesús Delgado González

## Definición de la Empresa

### Nombre

**PixelVault** — Tienda en línea de videojuegos y consolas retro.

### Misión

Ofrecer a los amantes de los videojuegos una plataforma accesible y confiable para adquirir videojuegos y consolas retro, brindando una experiencia de compra nostálgica, intuitiva y segura que conecte a los usuarios con los clásicos que marcaron generaciones.

### Visión

Ser la tienda en línea de referencia en videojuegos y consolas retro en la región, reconocida por la calidad de su catálogo, su estilo visual único inspirado en la era dorada de los videojuegos y la excelencia en la experiencia de usuario.

### Valores

- **Nostalgia:** Celebramos la historia de los videojuegos y su legado cultural.
- **Calidad:** Garantizamos productos en óptimas condiciones y un servicio confiable.
- **Pasión:** Compartimos el amor por los clásicos del gaming con nuestra comunidad.
- **Accesibilidad:** Facilitamos el acceso a piezas de colección para todos los aficionados.

### Estilo Visual

Diseño retro pixeleado basado en [NES.css](https://nostalgic-css.github.io/NES.css/), evocando la estética de la era de 8 bits.

### Iconos

https://www.streamlinehq.com/icons/pixel

## Estructura del proyecto

El repositorio contiene dos aplicaciones que se ejecutan en paralelo:

| Carpeta | Tecnología | Descripción |
|---|---|---|
| [`pixelvault-backend/`](./pixelvault-backend) | Node.js, Express y Mongoose | API REST de PixelVault (puerto 3000). |
| [`pixelvault-vue/`](./pixelvault-vue) | Vue 3 + Vite | Aplicación web de PixelVault (puerto 5173). |

## Ejecución del proyecto

El proyecto completo se compone de **dos partes**: el backend (API REST) y el
frontend (aplicación web). Deben ejecutarse **en este orden** y quedar
corriendo en paralelo, cada uno en su propia terminal.

### Requisitos

- **Node.js** `^22.18.0` o `>=24.12.0`
- **npm** (incluido con Node.js)
- Una base de datos **MongoDB Atlas** para el backend (requerida por el curso).

### Clonación del repositorio

Con HTTPS:

```sh
git clone https://github.com/awestrau/webdev-proyecto.git
cd webdev-proyecto
```

Con SSH:

```sh
git clone git@github.com:awestrau/webdev-proyecto.git
cd webdev-proyecto
```

### 1. Backend (`pixelvault-backend/`)

**a) Verificar el archivo `.env`**

El backend lee sus variables de entorno desde un único archivo `.env` en la
**raíz del repositorio** (tanto `npm run dev` como `npm run seed` lo cargan
desde allí). El repositorio se entrega con este archivo **ya configurado**
(`MONGO_URI` de MongoDB Atlas y `JWT_SECRET`), por lo que no es necesario
crear nada.

> Si el archivo `.env` faltara (por ejemplo, al clonar el repositorio desde
> cero), recrealo copiando la plantilla:
>
> ```sh
> cp pixelvault-backend/.env.example .env
> ```
>
> y completá las variables mínimas:
>
> - `MONGO_URI`: cadena de conexión de **MongoDB Atlas**, que se obtiene desde
>   el cluster en Atlas Cloud (copiala seleccionando el driver "Node.js").
> - `JWT_SECRET`: secreto con el que se firman los tokens JWT (HS256).
> - `MONGO_DB_NAME`: nombre de la base de datos (opcional, por defecto `pixelvault`).

**b) Instalar dependencias:**

```sh
cd pixelvault-backend
npm install
```

**c) Iniciar el servidor:**

```sh
npm run dev
```

La API queda disponible en <http://localhost:3000>.

> **Nota:** la base de datos se entrega **ya construida y cargada** (categorías,
> productos, usuarios — incluido el administrador —, órdenes y carritos). No es
> necesario ejecutar `npm run seed`; este comando solo sirve para poblar una
> base desde cero en desarrollo.

### 2. Frontend (`pixelvault-vue/`)

**a) Verificar el archivo `.env`**

El repositorio se entrega con el `.env` del frontend **ya creado y
configurado**, con el único valor requerido `VITE_API_URL=http://localhost:3000/api`
que apunta a la API del backend.

> Si el archivo faltara (por ejemplo, al clonar el repositorio desde cero),
> crealo a partir de la plantilla incluida. Si abriste una terminal nueva,
> partí de la raíz del repositorio:
>
> ```sh
> cd pixelvault-vue
> cp .env.example .env
> ```
>
> > Si venís del paso 1 (terminaste dentro de `pixelvault-backend/`), usá
> > `cd ../pixelvault-vue` en su lugar.
>
> El único valor requerido es `VITE_API_URL=http://localhost:3000/api`, que
> apunta a la API del backend.

**b) Instalar dependencias:**

```sh
npm install
```

**c) Iniciar el servidor de desarrollo (con recarga en caliente):**

```sh
npm run dev
```

Se levanta en <http://localhost:5173>.

### 3. Abrir la aplicación

Ingresá a <http://localhost:5173>. El frontend requiere que el backend esté
corriendo en el puerto 3000 para consumir la API.

### Compilación para producción (frontend)

```sh
npm run build
```

El resultado se genera en `pixelvault-vue/dist/`.

### Vista previa de la compilación (frontend)

```sh
npm run preview
```

## Acceso al panel de administración

El panel de administración se encuentra en la ruta **`/admin-portal`** del
frontend. Es una ruta protegida: solo un usuario con sesión iniciada y rol
`admin` puede verla y utilizarla (cualquier otro visitante es redirigido a
`/login` o a la página principal).

Para verificar el panel se documentan las siguientes credenciales:

| Campo | Valor |
|---|---|
| Correo | `admin@pixelvault.com` |
| Contraseña | `admin1234` |

> **Nota:** esta credencial es de **verificación académica** (mock) para que el
> docente pueda revisar el panel. La base de datos se entrega ya cargada con
> este usuario administrador (rol `admin`); no es necesario sembrar datos. No
> corresponde a un usuario de producción.

Desde el panel se gestionan **Productos, Usuarios, Categorías y Órdenes**, y
solo el admin puede crear otros administradores (desde la sección Usuarios).

### Cómo verificar el panel

1. Abrí <http://localhost:5173> con el backend y el frontend corriendo en
   paralelo.
2. Andá a `/login` e ingresá con `admin@pixelvault.com` / `admin1234`.
3. El sistema redirige automáticamente a `/admin-portal` (el frontend
   redirige a los administradores tras el login).
4. Verificá que el panel muestre las secciones **Productos, Usuarios,
   Categorías y Órdenes**.

> **Nota:** si la sesión no tiene rol `admin` (por ejemplo, una cuenta
> `customer`), el sistema redirige a la página principal (`/`) y el panel no
> es accesible.

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
