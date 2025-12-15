# Sistema de Factorización QR de Matrices

Sistema fullstack que calcula la factorización QR de matrices con arquitectura de microservicios.

## 📋 Descripción del Proyecto

Este proyecto implementa un sistema distribuido para calcular la factorización QR de matrices, compuesto por:

- **API Go (puerto 8080)**: Calcula la factorización QR usando la biblioteca gonum
- **API Node.js (puerto 3000)**: Calcula estadísticas sobre las matrices Q y R
- **Frontend React (puerto 5173)**: Interfaz de usuario para ingresar matrices y visualizar resultados

## 🏗️ Arquitectura

### Flujo de Datos

```
Usuario → Frontend → API Go (calcula QR) → API Node (estadísticas) → API Go → Frontend
```

### Stack Tecnológico

- **API 1**: Go 1.21+ con Fiber v2
- **API 2**: Node.js 18+ con Express y TypeScript
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Infraestructura**: Docker + Docker Compose

## 📁 Estructura del Proyecto

```
.
├── go-api/              # API Go con Clean Architecture
│   ├── cmd/
│   ├── internal/
│   │   ├── handlers/
│   │   ├── services/
│   │   ├── models/
│   │   └── middleware/
│   ├── config/
│   └── Dockerfile
├── node-api/            # API Node.js con MVC Pattern
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── utils/
│   ├── tests/
│   └── Dockerfile
├── frontend/            # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🚀 Requisitos Previos

- Docker 20.10+
- Docker Compose 2.0+
- (Opcional) Go 1.21+ y Node.js 18+ para desarrollo local

## 📦 Instalación y Ejecución

### Con Docker (Recomendado)

1. Clonar el repositorio:
```bash
git clone <repository-url>
cd RetoTecnico
```

2. Crear archivo `.env` basado en `.env.example`:
```bash
cp .env.example .env
```

3. Editar `.env` y configurar las variables de entorno:
```env
JWT_SECRET=your-super-secret-key-change-in-production
NODE_API_URL=http://node-api:3000
VITE_GO_API_URL=http://localhost:8080
```

4. Construir y ejecutar todos los servicios:
```bash
docker-compose up --build
```

5. Acceder a la aplicación:
   - Frontend: http://localhost:5173
   - API Go: http://localhost:8080
   - API Node.js: http://localhost:3000

### Sin Docker (Desarrollo Local)

#### API Go

```bash
cd go-api
go mod download
go run cmd/main.go
```

#### API Node.js

```bash
cd node-api
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔌 Endpoints de las APIs

### API Go (puerto 8080)

#### POST /api/v1/login
Autenticación de usuario.

**Request:**
```json
{
  "username": "user",
  "password": "pass"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /api/v1/matrix/qr
Calcula la factorización QR de una matriz.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "matrix": [
    [12, -51, 4],
    [6, 167, -68],
    [-4, 24, -41]
  ]
}
```

**Response:**
```json
{
  "original": [[12, -51, 4], [6, 167, -68], [-4, 24, -41]],
  "Q": [[...], [...], [...]],
  "R": [[...], [...], [...]],
  "statistics": {
    "max": 10.5,
    "min": -3.2,
    "average": 4.3,
    "sum": 45.6,
    "isDiagonal": {
      "Q": false,
      "R": true
    }
  }
}
```

#### GET /health
Health check del servicio.

**Response:**
```json
{
  "status": "healthy",
  "service": "go-api"
}
```

### API Node.js (puerto 3000)

#### POST /api/v1/statistics
Calcula estadísticas de las matrices Q y R.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "Q": [[...], [...], [...]],
  "R": [[...], [...], [...]]
}
```

**Response:**
```json
{
  "max": 10.5,
  "min": -3.2,
  "average": 4.3,
  "sum": 45.6,
  "isDiagonal": {
    "Q": false,
    "R": true
  }
}
```

#### GET /health
Health check del servicio.

**Response:**
```json
{
  "status": "healthy",
  "service": "node-api"
}
```

## 🧪 Testing

### Tests Go

```bash
cd go-api
go test ./...
```

### Tests Node.js

```bash
cd node-api
npm test
```

Para ver el coverage:
```bash
npm run test:coverage
```

## 🔐 Variables de Entorno

### API Go (.env)
- `JWT_SECRET`: Secreto para firmar tokens JWT
- `NODE_API_URL`: URL de la API Node.js (default: http://node-api:3000)
- `PORT`: Puerto del servidor (default: 8080)

### Credenciales para login (opcional)

- `ADMIN_USER`: Nombre de usuario administrador. Si está vacío, el sistema aceptará cualquier credencial no vacía (modo demo).
- `ADMIN_PASS`: Contraseña de administrador. Si está vacío, el sistema aceptará cualquier credencial no vacía (modo demo).

Para habilitar la verificación estricta de credenciales, establece `ADMIN_USER` y `ADMIN_PASS` en el archivo `.env`.

### API Node.js (.env)
- `JWT_SECRET`: Secreto para verificar tokens JWT
- `PORT`: Puerto del servidor (default: 3000)

### Frontend (.env)
- `VITE_GO_API_URL`: URL de la API Go (default: http://localhost:8080)

## 📝 Ejemplo de Matriz de Prueba

```json
{
  "matrix": [
    [12, -51, 4],
    [6, 167, -68],
    [-4, 24, -41]
  ]
}
```

## 🛠️ Características Implementadas

### API Go
- ✅ Clean Architecture
- ✅ Factorización QR usando gonum
- ✅ Validación de matrices rectangulares
- ✅ Cliente HTTP para comunicación con API Node.js
- ✅ Middleware JWT
- ✅ CORS habilitado
- ✅ Logger estructurado
- ✅ Manejo de errores robusto
- ✅ Tests unitarios

### API Node.js
- ✅ MVC Pattern
- ✅ Cálculo de estadísticas (max, min, average, sum)
- ✅ Verificación de matrices diagonales
- ✅ Validación con Zod
- ✅ Middleware JWT
- ✅ Rate limiting
- ✅ Tests con Jest y Supertest

### Frontend
- ✅ Componente de entrada de matriz dinámico
- ✅ Visualización de matrices Q y R
- ✅ Componente de estadísticas
- ✅ Autenticación con JWT
- ✅ Loading states
- ✅ Toast notifications
- ✅ Diseño responsive con Tailwind CSS

## 🔄 Cambios recientes

- **Corrección en `ComputeQR` (API Go)**: se solucionó un desajuste de dimensiones al factorizar matrices rectangulares. Ahora se genera la matriz Q completa y se devuelve la versión "económica" (tamaño filas × min(filas, columnas)), evitando pánicos por dimensiones incompatibles.
- **Tests ampliados**: se añadieron y verificaron tests para matrices 3x3, 4x3, 5x4, y casos con columnas nulas (`TestComputeQR_3x3`, `TestComputeQR_4x3`, `TestComputeQR_5x4`, `TestComputeQR_WithZeroColumn`, `TestComputeQR_Orthogonality`).
- **Limpieza de tests**: se removió un import no usado (`math`) que provocaba fallo en la compilación de tests.

### Cómo verificar los cambios localmente

1. Ejecutar los tests específicos de QR:

```bash
cd go-api
go test ./internal/services -v -run TestComputeQR
```

2. Ejecutar todo el suite de Go:

```bash
cd go-api
go test ./...
```

Los cambios ya han sido validados localmente y los tests de QR pasan correctamente.

## 📚 Principios de Desarrollo

- ✅ SOLID principles
- ✅ Clean Code
- ✅ DRY (Don't Repeat Yourself)
- ✅ Error handling consistente
- ✅ Logging estructurado
- ✅ Validación robusta
- ✅ Tests unitarios (>70% coverage)
- ✅ TypeScript strict mode
- ✅ Go con tipos explícitos

## 🐛 Troubleshooting

### Error: "Connection refused" entre servicios
Asegúrate de que todos los servicios estén en la misma red Docker y que los nombres de los servicios coincidan con los definidos en `docker-compose.yml`.

### Error: "JWT_SECRET not set"
Verifica que el archivo `.env` exista y contenga `JWT_SECRET`.

### Error: "Port already in use"
Detén otros servicios que estén usando los puertos 8080, 3000 o 5173.

## 📄 Licencia

Este proyecto es un reto técnico de demostración.

