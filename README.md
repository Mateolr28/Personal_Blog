# Mateo Largo — Personal Portfolio, Travel Log & Aviation Archive

Aplicación web profesional completa desarrollada en **React 18+**, **TypeScript**, **Tailwind CSS**, y backend con **Supabase (PostgreSQL, Auth & Storage)**.

---

## 🚀 Características Principales

### 🌐 Módulos Públicos
- **Inicio (Hero & Highlights):** Presentación personal, estado de disponibilidad, avatar, stack tecnológico, proyectos destacados, bitácoras recientes y vitrina de fotografía de plane spotting.
- **Sobre Mí (`/about`):** Biografía profesional, áreas de interés, datos de contacto y catálogo interactivo de tecnologías agrupadas por categoría (Frontend, Backend, Database, DevOps, Tools).
- **Experiencia Laboral (`/experience`):** Línea de tiempo interactiva con roles, empresas, períodos, logros clave y tecnologías utilizadas.
- **Proyectos de Software (`/projects` & `/projects/:id`):** Portafolio con filtrado por estado (Completado, En desarrollo, Pausado), buscador, enlaces a demo y GitHub, visor de imágenes en alta resolución (Lightbox) y reproductor de video.
- **Bitácora de Viajes (`/travel` & `/travel/:id`):** Catálogo de viajes con países, ciudades, coordenadas geográficas, relatos fotográficos, hitos visitados y visor Lightbox.
- **Archivo Digital de Aviación (`/aviation` & `/aviation/:id`):** Registro especializado de plane spotting con filtros avanzados por fabricante (Airbus, Boeing, Embraer, etc.), aerolínea, aeropuerto IATA/ICAO y tipo de aeronave. Incluye fichas técnicas completas con matrícula, modelo y número de serie (MSN).
- **Contacto (`/contact`):** Formulario con validación completa y almacenamiento directo en la base de datos para responder desde el panel administrador.
- **Modo Oscuro / Claro:** Soporte completo de temas con persistencia en `localStorage`.

### 🛡️ Panel de Administración (`/admin`)
- **Autenticación Segura:** Login con Supabase Auth y guardia de rutas protegidas.
- **Dashboard con Métricas:** Estadísticas en tiempo real de proyectos, viajes, registros de aviación y mensajes sin leer.
- **CRUD Completo:**
  - Gestión de Perfil & Biografía
  - Gestión de Experiencias Laborales
  - Gestión de Tecnologías & Habilidades
  - Gestión de Proyectos con subida de imágenes a Storage
  - Gestión de Bitácoras de Viaje
  - Gestión de Registros de Aviación Spotting
  - Bandeja de Entrada de Mensajes con respuesta directa vía `mailto`
  - Centro de Diagnósticos y Script SQL de Supabase

---

## 🛠️ Tecnologías Empleadas

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion (para transiciones).
- **Iconos:** Lucide React.
- **Backend & Almacenamiento:** Supabase (PostgreSQL, Supabase Storage `portfolio-media`, Supabase Auth).
- **Resiliencia Local:** Modo híbrido con fallback en `localStorage` y datos semilla (`seedData.ts`) cuando no hay conexión activa a Supabase.

---

## 📦 Configuración & Despliegue

### 1. Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto basado en `.env.example`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

### 2. Base de Datos en Supabase
1. Accede a tu consola de [Supabase](https://supabase.com).
2. Ve al **SQL Editor** -> **New Query**.
3. Copia y ejecuta todo el contenido de `supabase/schema.sql` (o cópialo desde `/admin/settings`).
4. Este script creará todas las tablas, funciones de verificación de rol administrador, políticas de seguridad RLS y el bucket de Storage `portfolio-media`.

### 3. Ejecución Local
```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🔒 Acceso Administrativo
- Ruta: `/admin/login`
- En desarrollo local sin Supabase configurado, puedes iniciar sesión con las credenciales demo precargadas (`admin@mateo.dev` / `admin123456`).
