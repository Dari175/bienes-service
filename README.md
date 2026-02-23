# 📦 Patrimonio Municipal — Microservicio REST

![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-Production--Ready-brightgreen)
![Deploy](https://img.shields.io/badge/deploy-Render-46E3B7?logo=render&logoColor=white)

---

## 📖 Descripción General

API REST desarrollada con **Node.js + Express + Mongoose** para la gestión integral del patrimonio municipal del **H. Ayuntamiento de Tula de Allende, Hidalgo**. Permite administrar, consultar y controlar los bienes municipales organizados por tipo (muebles, cómputo, vehículos, inmuebles, balístico y control), con soporte para búsqueda global, filtros dinámicos, estadísticas por agregación y paginación automática.

---

## 🚀 Características Principales

| Característica | Detalle |
|---|---|
| CRUD completo | Por cada colección disponible |
| Filtros dinámicos | Vía query params especializados por colección |
| Búsqueda global | Entre todas las colecciones simultáneamente (`?q=texto`) |
| Estadísticas | Por agregación nativa de MongoDB por colección |
| Paginación | Automática, máximo 200 registros por página |
| Arquitectura | Modular MVC con `crudFactory` genérico reutilizable |
| Base de datos | Compatible con MongoDB Atlas |
| Despliegue | Preparado para Render (PaaS) |

---

## 🗂️ Estructura del Proyecto

```
patrimonio-microservicio/
├── src/
│   ├── config/
│   │   └── db.js                    # Conexión a MongoDB Atlas
│   ├── controllers/
│   │   ├── index.js                 # Re-exporta todos los controladores + stats global
│   │   ├── globalController.js      # GET /api/stats y GET /api/search
│   │   ├── muebleController.js
│   │   ├── computoController.js
│   │   ├── balisticoController.js
│   │   ├── inmuebleController.js
│   │   ├── vehiculoController.js
│   │   ├── controlController.js
│   │   ├── catalogoController.js
│   │   └── crudFactory.js           # Fábrica genérica de controladores CRUD
│   ├── models/                      # Esquemas Mongoose
│   ├── routes/                      # Definición de rutas Express
│   ├── middleware/                  # Middlewares globales (errores, validación)
│   └── index.js                     # Punto de entrada del servidor
├── .env                             # Variables de entorno (NO subir al repo)
├── .gitignore
├── package.json
└── README.md
```

---

## 🌍 Endpoints Globales

### Health Check
```
GET /
```
Verifica que el servidor esté activo. Responde con `200 OK`.

---

### Estadísticas Globales
```
GET /api/stats
```
Devuelve conteos de **todas** las colecciones, incluyendo un `total_bienes` acumulado (excluye catálogo).

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total_bienes": 2775,
    "colecciones": {
      "bienes_generales_muebles": 1240,
      "bienes_generales_computo": 860,
      "bienes_generales_equipo_balistico": 200,
      "bienes_generales_inmuebles": 120,
      "bienes_generales_parque_vehicular": 45,
      "bienes_control": 310,
      "bienes_generales_catalogo": 75
    }
  }
}
```

---

### Búsqueda Global
```
GET /api/search?q={texto}
```
Busca simultáneamente en muebles, cómputo, balístico, inmuebles, vehículos y control. Retorna hasta **10 resultados por colección**.

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `q` | `string` | ✅ Sí | Texto a buscar. Sin él devuelve `400`. |

**Respuesta:**
```json
{
  "success": true,
  "query": "escritorio",
  "data": {
    "muebles": [...],
    "computo": [...],
    "balistico": [...],
    "inmuebles": [...],
    "vehiculos": [...],
    "control": [...]
  }
}
```

---

## 📁 Colecciones Disponibles

| Ruta Base | Colección MongoDB | Descripción |
|---|---|---|
| `/api/muebles` | `bienes_generales_muebles` | Mobiliario general de oficina |
| `/api/computo` | `bienes_generales_computo` | Equipos de cómputo y tecnología |
| `/api/balistico` | `bienes_generales_equipo_balistico` | Equipo balístico y chalecos |
| `/api/inmuebles` | `bienes_generales_inmuebles` | Bienes raíces municipales |
| `/api/vehiculos` | `bienes_generales_parque_vehicular` | Parque vehicular |
| `/api/control` | `bienes_control` | Bienes bajo control especial |
| `/api/catalogo` | `bienes_generales_catalogo` | Catálogo de clasificación armonizada |

---

## 🔎 Estructura CRUD por Colección

```
GET     /api/{coleccion}          → Listar todos (paginación + filtros)
GET     /api/{coleccion}/stats    → Estadísticas de esa colección
GET     /api/{coleccion}/:id      → Obtener un registro por ObjectId
POST    /api/{coleccion}          → Crear nuevo registro
PUT     /api/{coleccion}/:id      → Reemplazar registro completo
PATCH   /api/{coleccion}/:id      → Actualizar campos específicos (misma lógica que PUT)
DELETE  /api/{coleccion}/:id      → Eliminar registro
```

**Respuesta estándar de lista:**
```json
{
  "success": true,
  "total": 1240,
  "page": 1,
  "limit": 50,
  "pages": 25,
  "data": [...]
}
```

---

## 🔍 Query Params por Colección

### Comunes a todas las colecciones

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `q` | `string` | — | Búsqueda libre en todos los campos string de la colección |
| `page` | `number` | `1` | Número de página (mínimo 1) |
| `limit` | `number` | `50` | Registros por página (máximo 200) |

### Filtros especializados por colección

| Colección | Param | Campo MongoDB al que apunta |
|---|---|---|
| `muebles` | `unidad` | `UNIDAD ADMINISTRATIVA` |
| `muebles` | `condicion` | `CONDICIÓN FÍSICA DEL BIEN` |
| `muebles` | `resguardante` | `NOMBRE DEL RESGUARDANTE` |
| `computo` | `marca` | `MARCA` |
| `computo` | `unidad` | `UNIDAD ADMINISTRATIVA` |
| `computo` | `condicion` | `CONDICIÓN FÍSICA DEL BIEN ` ⚠️ espacio al final |
| `computo` | `resguardante` | `NOMBRE DEL RESGUARDANTE` |
| `balistico` | `resguardante` | `Nombre del resguardante` |
| `inmuebles` | `uso` | `Uso o destino` |
| `inmuebles` | `forma` | `Forma de adquisición` |
| `inmuebles` | `situacion` | `Situación legal del bien inmueble` |
| `inmuebles` | `responsable` | `Responsable de la guardia y custodia del documento que ampara la propiedad` |
| `vehiculos` | `marca` | `Marca` |
| `vehiculos` | `tipo` | `Tipo` |
| `vehiculos` | `estado` | `Estado fisico del vehículo` |
| `vehiculos` | `resguardante` | `Nombre del Resguardante` |
| `vehiculos` | `propiedad` | `Propiedad del Ayuntamiento / Comodato` |
| `control` | `unidad` | `UNIDAD ADMINISTRATIVA` |
| `control` | `condicion` | `CONDICIÓN FÍSICA DEL BIEN` |
| `control` | `resguardante` | `NOMBRE DEL RESGUARDANTE` |

---

## 📄 Esquemas Completos por Colección

> ⚠️ **CRÍTICO — Nombres de campos exactos:** Los nombres provienen del sistema municipal original. Varios tienen espacios al final, tildes en posiciones inusuales o typos que **deben respetarse tal cual** en cualquier query, filtro, proyección o body de POST/PUT/PATCH.

---

### 🪑 Muebles (`/api/muebles`)
**Colección MongoDB:** `bienes_generales_muebles`
**Campos buscables con `?q=`:** 14 campos

```json
{
  "_id": "ObjectId",
  "NO. DE RESGUARDO": 1,
  "NO. DE INVENTARIO": 1,
  "CLAVE ARMONIZADA": "5111-REM-001-11",
  "NOMBRE DEL RESGUARDANTE": "FERNANDO FARIAS ESTRADA",
  "UNIDAD ADMINISTRATIVA": "REGLAMENTOS Y ESPECTACULOS",
  "UBICACIÓN ACTUAL": "REGLAMENTOS Y ESPECTACULOS",
  "DESCRIPCIÓN FÍSICA DEL BIEN": "ESCRITORIO DE MADERA CON 2 CAJONES",
  "MARCA": "S/M",
  "MODELO": "S/M",
  "NO. DE SERIE": "S/F",
  "FACTURA O DOCUMENTO QUE AMPARA": "S/F",
  "FECHA DE ADQUISICIÓN ": null,
  "VALOR DE ADQUISICIÓN": null,
  "CONDICIÓN FÍSICA DEL BIEN": "MALO"
}
```

> ⚠️ `"FECHA DE ADQUISICIÓN "` — tiene **espacio al final** del nombre del campo en la base de datos.

**Estadísticas (`GET /api/muebles/stats`):**
```json
{
  "success": true,
  "data": {
    "total": 1240,
    "por_condicion": [{ "_id": "MALO", "count": 540 }, { "_id": "REGULAR", "count": 400 }],
    "top_unidades": [{ "_id": "REGLAMENTOS Y ESPECTACULOS", "count": 120 }]
  }
}
```

---

### 💻 Cómputo (`/api/computo`)
**Colección MongoDB:** `bienes_generales_computo`
**Campos buscables con `?q=`:** 15 campos

```json
{
  "_id": "ObjectId",
  "NO. DE RESGUARDO": 3125,
  "NO. DE INVENTARIO": "INV-3125",
  "CLAVE ARMONIZADA": "5151-TEC-001-22",
  "NOMBRE DEL RESGUARDANTE": "MARIA LOPEZ HERNANDEZ",
  "UNIDAD ADMINISTRATIVA": "SISTEMAS",
  "UBICACIÓN ACTUAL": "OFICINA SISTEMAS",
  "DESCRIPCIÓN FÍSICA DEL BIEN": "LAPTOP DELL INSPIRON 15",
  "MARCA": "PANASONIC",
  "MODELO": "M.FXT500",
  "NO. DE SERIE": "9DCMA190102",
  "FACTURA O DOCUMENTO QUE AMPARA": "F-2021-0089",
  "FECHA DE ADQUISICIÓN": "2021-03-15",
  "VALOR DE ADQUISICIÓN": 12500.00,
  "CONDICIÓN FÍSICA DEL BIEN ": "MALO",
  "OBSERVACIÓN": "Pantalla dañada"
}
```

> ⚠️ `"CONDICIÓN FÍSICA DEL BIEN "` — tiene **espacio al final** del nombre del campo en la base de datos.

**Estadísticas (`GET /api/computo/stats`):**
```json
{
  "success": true,
  "data": {
    "total": 860,
    "top_marcas": [{ "_id": "DELL", "count": 210 }, { "_id": "PANASONIC", "count": 180 }],
    "por_condicion": [{ "_id": "MALO", "count": 320 }],
    "top_unidades": [{ "_id": "SISTEMAS", "count": 95 }]
  }
}
```

---

### 🦺 Balístico (`/api/balistico`)
**Colección MongoDB:** `bienes_generales_equipo_balistico`
**Campos buscables con `?q=`:** 6 campos

```json
{
  "_id": "ObjectId",
  "Nombre del resguardante": "ALBERTO TOVAR CORONADO",
  "Unidad": 10,
  "Descripción": "CHALECOS PLAQUERO",
  "Marca": "S/M",
  "Modelo": "S/M",
  "No. Serie": "S/F",
  "Observaciones": "En buen estado"
}
```

> ℹ️ Esta colección usa **CamelCase** en los nombres de campo (a diferencia de muebles/cómputo/control que usan MAYÚSCULAS).
> ℹ️ `"Unidad"` es un campo **numérico** — representa la cantidad de unidades. Se usa en stats para sumar totales por tipo de bien.

**Estadísticas (`GET /api/balistico/stats`):**
```json
{
  "success": true,
  "data": {
    "total": 200,
    "por_tipo": [
      { "_id": "CHALECOS PLAQUERO", "totalUnidades": 85, "registros": 12 },
      { "_id": "CASCO BALÍSTICO", "totalUnidades": 40, "registros": 5 }
    ]
  }
}
```

---

### 🏠 Inmuebles (`/api/inmuebles`)
**Colección MongoDB:** `bienes_generales_inmuebles`
**Campos buscables con `?q=`:** 11 campos

```json
{
  "_id": "ObjectId",
  "Número de inventario": "SIND1",
  "Clave Armonizada": "MAT5800/583",
  "Descripción del bien inmueble": "LOTE DE 2572 METROS CUADRADOS",
  "Número del documento que ampara la propiedad del bien": "ESCRITURA-001",
  "Documento que ampara la propiedad del bien": "ESCRITURA PÚBLICA",
  "Responsable de la guardia y custodia del documento que ampara la propiedad": "JUAN PÉREZ GARCÍA",
  "Situación legal del bien inmueble": "EN REGLA",
  "Ubicación": "PRADERAS DEL POTRERO, TULA DE ALLENDE",
  "Uso o destino": "PLANTEL EDUCATIVO",
  "Forma de adquisición": "DONACIÓN",
  "Fecha de adquisición /movimiento": 1113782400000,
  "Valor de adquisición /movimiento": 400.00,
  "Observaciones": "Sin observaciones"
}
```

> ⚠️ `"Fecha de adquisición /movimiento"` es un **timestamp Unix en milisegundos**.
> Convertir en JavaScript: `new Date(1113782400000)` → `2005-04-18T00:00:00.000Z`

**Estadísticas (`GET /api/inmuebles/stats`):**
```json
{
  "success": true,
  "data": {
    "total": 120,
    "por_uso": [{ "_id": "PLANTEL EDUCATIVO", "count": 35 }],
    "por_forma_adquisicion": [{ "_id": "DONACIÓN", "count": 60 }],
    "por_situacion_legal": [{ "_id": "EN REGLA", "count": 98 }]
  }
}
```

---

### 🚗 Vehículos (`/api/vehiculos`)
**Colección MongoDB:** `bienes_generales_parque_vehicular`
**Campos buscables con `?q=`:** 19 campos

```json
{
  "_id": "ObjectId",
  "CLAVE ": "VEH-001",
  "Marca": "NISSAN",
  "Tipo": "ESTACAS",
  "Color": "BLANCO",
  "Placas": "ABC-123-B",
  "MatrÍcula": "M-0045",
  "Serie": "3N6DD14S67K028974",
  "No. de Motor": "QR25-123456",
  "Tarjeta de circulación": "TC-2023-001",
  "Verificación": "2024",
  "Tenencia": "PAGADA",
  "Estado fisico del vehículo": "REGULAR",
  "No. De Factura": "F-2019-0012",
  "Valor Factura": 180000.00,
  "Precio en libros": 90000.00,
  "Nombre del Resguardante": "JUAN CARLOS MARTÍNEZ RODRÍGUEZ",
  "Propiedad del Ayuntamiento / Comodato": "AYUNTAMIENTO",
  "Ubicación": "PARQUE VEHICULAR MUNICIPAL",
  "Observaciones": "Requiere servicio"
}
```

> ⚠️ `"CLAVE "` — tiene **espacio al final** del nombre del campo en la base de datos.
> ⚠️ `"MatrÍcula"` — la **Í es mayúscula con tilde**. Copiar exactamente este nombre al construir queries.

**Estadísticas (`GET /api/vehiculos/stats`):**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "top_marcas": [{ "_id": "NISSAN", "count": 12 }],
    "por_tipo": [{ "_id": "ESTACAS", "count": 8 }],
    "por_estado_fisico": [{ "_id": "REGULAR", "count": 18 }],
    "por_dependencia": [{ "_id": "AYUNTAMIENTO", "count": 30 }]
  }
}
```

---

### 🔒 Control (`/api/control`)
**Colección MongoDB:** `bienes_control`
**Campos buscables con `?q=`:** 16 campos

```json
{
  "_id": "ObjectId",
  "NO. RESGUARDO": 501,
  "NO. DE INVENTARIO": "CTL-501",
  "CLAVE ARMONIZADA": "5191-CTL-001-01",
  "NOMBRE DEL RESGUARDANTE": "PEDRO RAMÍREZ LUNA",
  "UNIDAD ADMINISTRATIVA": "SEGURIDAD PÚBLICA",
  "UBICACIÓN ACTUAL": "COMANDANCIA",
  "UNIDAD": "DIRECCIÓN DE SEGURIDAD",
  "DESCRIPCIÓN": "RADIO PORTÁTIL MOTOROLA",
  "MARCA": "MOTOROLA",
  "MODELO": "DEP550",
  "NÚMERO DE SERIE": "SN-2021-0099",
  "FACTURA O DOCUMENTO QUE AMPARA": "F-2021-0033",
  "FECHA DE ADQUISICIÓN": "2021-06-01",
  "VALOR DE ADQUISICIÓN": 4500.00,
  "CONDICIÓN FÍSICA DEL BIEN": "BUENO",
  "OBSERVACIÓNES": "Con cargador incluido"
}
```

> ⚠️ `"OBSERVACIÓNES"` — tiene **tilde en la Ó** (typo original del sistema municipal). Usar exactamente así.
> ℹ️ Diferencia con muebles: aquí el campo es `"NO. RESGUARDO"` (sin "DE") y la descripción usa `"DESCRIPCIÓN"` (sin "FÍSICA DEL BIEN").

**Estadísticas (`GET /api/control/stats`):**
```json
{
  "success": true,
  "data": {
    "total": 310,
    "por_condicion": [{ "_id": "BUENO", "count": 140 }],
    "top_unidades": [{ "_id": "SEGURIDAD PÚBLICA", "count": 85 }]
  }
}
```

---

### 📚 Catálogo (`/api/catalogo`)
**Colección MongoDB:** `bienes_generales_catalogo`

**Documento en MongoDB (estructura anidada original):**
```json
{
  "_id": "ObjectId",
  "SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD": {
    "clave": "1.2.4.1.1",
    "descripcion": "Muebles de Oficina y Estantería"
  },
  "CLASIFICADOR POR OBJETO DE GASTO": {
    "codigo": 511,
    "descripcion": "Muebles de Oficina y Estantería"
  }
}
```

**Respuesta del API (estructura aplanada automáticamente por el controlador):**
```json
{
  "_id": "ObjectId",
  "subcuenta_clave": "1.2.4.1.1",
  "subcuenta_descripcion": "Muebles de Oficina y Estantería",
  "clasificador_codigo": 511,
  "clasificador_descripcion": "Muebles de Oficina y Estantería",
  "_raw": {
    "SUBCUENTAS ARMONIZADAS PARA DAR CUMPLIMIENTO CON LA LEY DE CONTABILIDAD": {
      "clave": "1.2.4.1.1",
      "descripcion": "Muebles de Oficina y Estantería"
    },
    "CLASIFICADOR POR OBJETO DE GASTO": {
      "codigo": 511,
      "descripcion": "Muebles de Oficina y Estantería"
    }
  }
}
```

**Campos de búsqueda (`?q=`):** busca en `subcuentas.clave`, `subcuentas.descripcion`, `clasificador.descripcion`

**Estadísticas (`GET /api/catalogo/stats`):**
```json
{
  "success": true,
  "data": {
    "total": 75,
    "coleccion": "bienes_generales_catalogo"
  }
}
```

---

## ⚙️ Arquitectura de Controladores

### `crudFactory.js` — Fábrica genérica

El proyecto incluye una fábrica reutilizable que genera controladores CRUD para cualquier modelo Mongoose:

```javascript
import { createCRUDController } from "./crudFactory.js";
import MiModelo from "../models/MiModelo.js";

const SEARCH_FIELDS = ["campo1", "campo2"];
export const { getAll, getById, create, update, patch, remove, stats } =
  createCRUDController(MiModelo, SEARCH_FIELDS);
```

**Comportamiento especial del `getAll` de la fábrica:**
Acepta cualquier query param adicional y lo aplica como filtro regex case-insensitive directamente sobre el campo de MongoDB con el mismo nombre. Ejemplo:
```
GET /api/muebles?MARCA=DELL  →  filter["MARCA"] = /DELL/i
```

> ⚠️ Los controladores individuales tienen filtros más controlados y seguros. Se recomienda usar la fábrica solo para nuevas colecciones en desarrollo, no en producción directamente.

---

## ⚙️ Instalación Local

### Prerequisitos

- Node.js v20.x o superior
- npm v9.x o superior
- Acceso a MongoDB Atlas (URI de conexión)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/patrimonio-microservicio.git
cd patrimonio-microservicio

# 2. Instalar dependencias
npm install

# 3. Crear archivo de variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# 4. Iniciar en modo desarrollo
npm run dev

# 5. Verificar
curl http://localhost:3000/
```

---

## 🔐 Variables de Entorno

Crear `.env` en la raíz. **Nunca subir al repositorio.**

### 🖥️ Local (desarrollo)

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://Arturo:<TU_PASSWORD>@ac-osoqmbj-shard-00-00.jy2fgtv.mongodb.net:27017,ac-osoqmbj-shard-00-01.jy2fgtv.mongodb.net:27017,ac-osoqmbj-shard-00-02.jy2fgtv.mongodb.net:27017/?tls=true&replicaSet=atlas-116cyi-shard-0&authSource=admin&retryWrites=true&w=majority
```

### 🌐 Producción (Render)

```env
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://Arturo:<TU_PASSWORD>@cluster0.jy2fgtv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

---

## 🚀 Despliegue en Render

1. Crear cuenta en [render.com](https://render.com)
2. **New > Web Service** → Conectar repositorio GitHub
3. Configurar: Build Command `npm install` / Start Command `npm start`
4. Agregar variables de entorno en el panel de Render
5. Deploy

---

## 🛠️ Problemas Técnicos Conocidos

### `Server selection timed out after 30000 ms`

**Causa:** URI sin parámetros de replicaSet. En local, MongoDB Atlas requiere conexión directa a los shards.

**Solución:** La URI de desarrollo local debe incluir obligatoriamente:
```
tls=true
replicaSet=atlas-116cyi-shard-0
authSource=admin
```

---

## 🧪 Ejemplos con curl

```bash
# Health check
curl http://localhost:3000/

# Estadísticas globales
curl http://localhost:3000/api/stats

# Búsqueda global
curl "http://localhost:3000/api/search?q=escritorio"

# Muebles — paginación
curl "http://localhost:3000/api/muebles?page=1&limit=10"

# Muebles — filtrar por unidad administrativa
curl "http://localhost:3000/api/muebles?unidad=REGLAMENTOS"

# Muebles — filtrar por condición física
curl "http://localhost:3000/api/muebles?condicion=MALO"

# Cómputo — filtrar por marca
curl "http://localhost:3000/api/computo?marca=PANASONIC"

# Vehículos — filtrar por estado físico
curl "http://localhost:3000/api/vehiculos?estado=REGULAR"

# Vehículos — filtrar por propiedad
curl "http://localhost:3000/api/vehiculos?propiedad=AYUNTAMIENTO"

# Inmuebles — por forma de adquisición
curl "http://localhost:3000/api/inmuebles?forma=DONACION"

# Inmuebles — estadísticas
curl http://localhost:3000/api/inmuebles/stats

# Obtener por ID
curl http://localhost:3000/api/muebles/64a1f2b3c4d5e6f7a8b9c0d1

# Crear mueble (body con campos exactos)
curl -X POST http://localhost:3000/api/muebles \
  -H "Content-Type: application/json" \
  -d '{
    "NO. DE RESGUARDO": 999,
    "NO. DE INVENTARIO": 999,
    "CLAVE ARMONIZADA": "5111-REM-001-99",
    "NOMBRE DEL RESGUARDANTE": "ARTURO LOPEZ CASTILLO",
    "UNIDAD ADMINISTRATIVA": "SISTEMAS",
    "UBICACIÓN ACTUAL": "OFICINA SISTEMAS",
    "DESCRIPCIÓN FÍSICA DEL BIEN": "SILLA ERGONÓMICA",
    "MARCA": "TRUPER",
    "MODELO": "S/M",
    "NO. DE SERIE": "S/F",
    "FACTURA O DOCUMENTO QUE AMPARA": "S/F",
    "FECHA DE ADQUISICIÓN ": null,
    "VALOR DE ADQUISICIÓN": 1200.00,
    "CONDICIÓN FÍSICA DEL BIEN": "BUENO"
  }'

# Actualizar campo específico (PATCH)
curl -X PATCH http://localhost:3000/api/muebles/64a1f2b3c4d5e6f7a8b9c0d1 \
  -H "Content-Type: application/json" \
  -d '{"CONDICIÓN FÍSICA DEL BIEN": "REGULAR"}'

# Eliminar
curl -X DELETE http://localhost:3000/api/muebles/64a1f2b3c4d5e6f7a8b9c0d1
```

---

## ⚠️ Tabla de Anomalías en Nombres de Campos

Esta tabla es esencial para trabajar correctamente con los datos. Todos los bugs relacionados con queries o filtros que no retornan datos son causados por no respetar los nombres exactos.

| Campo | Colección | Anomalía | Nombre exacto a usar |
|---|---|---|---|
| Fecha de adquisición | muebles | Espacio al final | `"FECHA DE ADQUISICIÓN "` |
| Condición física | computo | Espacio al final | `"CONDICIÓN FÍSICA DEL BIEN "` |
| Clave | vehiculos | Espacio al final | `"CLAVE "` |
| Matrícula | vehiculos | Í mayúscula con tilde | `"MatrÍcula"` |
| Observaciones | control | Ó con tilde (typo original) | `"OBSERVACIÓNES"` |
| Fecha de adquisición | inmuebles | Timestamp en ms, no fecha | `new Date(valor)` para convertir |
| Convención general | muebles / computo / control | Todo en MAYÚSCULAS | `"NOMBRE DEL RESGUARDANTE"` |
| Convención general | inmuebles / vehiculos / balistico | CamelCase | `"Nombre del Resguardante"` |

---

## 👨‍💻 Autor

**Arturo Darinel López Castillo**
Universidad Tecnológica Tula-Tepeji (UTTT)
Ingeniería en Desarrollo y Gestión de Software
Tula de Allende, Hidalgo, México

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).