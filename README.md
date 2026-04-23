<div align="center">

# 🎬 Repositorio de Ocio

**Aplicación web para registrar y gestionar tu catálogo personal de entretenimiento.**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## 🧠 ¿Qué es esto?

**Repositorio de Ocio** es una aplicación web donde cada usuario puede gestionar su propio catálogo de entretenimiento: películas, series, juegos, libros o lo que quieras registrar. Los datos son privados y están sincronizados en la nube mediante Firebase.

---

## ✨ Funcionalidades

- 🔐 **Autenticación de usuarios** — Inicio de sesión con Firebase Auth
- ➕ **Añadir entradas** — Registra nuevo contenido de ocio con un modal
- 🗑️ **Eliminar** — Borra entradas de tu catálogo
- ✏️ **Editar** — Modifica los datos de cualquier entrada
- 🔍 **Buscar** — Filtra tu catálogo fácilmente con la barra de búsqueda
- 📋 **Vista en tarjetas** — Presenta el contenido en un diseño visual de tarjetas
- 👁️ **Modal de detalle** — Consulta los datos completos de cada entrada

---

## 🗂️ Estructura del Proyecto

```
repositorio-ocio/src/
│
├── App.jsx                  → Punto de entrada, gestión de autenticación
├── firebase.js              → Configuración de Firebase (Auth + Firestore)
│
└── components/
    ├── Show.jsx             → Vista principal con el catálogo y el filtro
    ├── Card.jsx             → Tarjeta visual de cada entrada
    ├── DetailModal.jsx      → Modal con los detalles completos de una entrada
    ├── SearchModal.jsx      → Modal para añadir o buscar nueva entrada
    ├── Login.jsx            → Pantalla de inicio de sesión
    └── getData.js           → Lógica para obtener datos externos
```

---

## ⚙️ Tecnologías

| Tecnología | Uso |
|---|---|
| **React + Vite** | Framework y bundler del proyecto |
| **Firebase Auth** | Autenticación de usuarios |
| **Firebase Firestore** | Base de datos en la nube (por usuario) |
| **React Icons** | Iconos de la interfaz |
| **CSS** | Estilos personalizados |

---

## 🔄 Flujo de la Aplicación

```
Usuario no autenticado  →  Pantalla de Login
         ↓ (autenticado)
Vista principal (Show)  →  Tarjetas del catálogo (Card)
         ↓
Clic en tarjeta         →  Modal de detalle (DetailModal)
         ↓
Botón añadir/buscar     →  Modal de búsqueda/añadir (SearchModal)
```

---

<div align="center">

**Tu catálogo de ocio, siempre contigo. 🎮🎬📚**

</div>
