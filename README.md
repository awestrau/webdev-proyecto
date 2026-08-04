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

## Ejecución del proyecto

La aplicación web está desarrollada con **Vue 3 + Vite** y se encuentra en la carpeta [`pixelvault-vue/`](./pixelvault-vue).

### Requisitos

- **Node.js** `^22.18.0` o `>=24.12.0`
- **npm** (incluido con Node.js)

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

### Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Landing page |
| `/products` | Catálogo de productos |
| `/producto/:id` | Detalle de un producto |
| `/login` y `/registro` | Iniciar sesión y crear cuenta |
| `/mi_carrito` | Carrito de compras (incluye checkout y pago) |
| `/guardados` | Productos guardados en favoritos |
