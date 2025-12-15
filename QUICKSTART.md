# Quick Start Guide

## 🚀 Inicio Rápido con Docker

1. **Clonar y configurar:**
```bash
# Crear archivo .env
cp .env.example .env

# Editar .env y configurar JWT_SECRET (opcional, tiene valor por defecto)
```

2. **Ejecutar todo el sistema:**
```bash
docker-compose up --build
```

3. **Acceder a la aplicación:**
   - Frontend: http://localhost:5173
   - API Go: http://localhost:8080/health
   - API Node.js: http://localhost:3000/health

## 🔑 Login

Usa cualquier username y password para el login de demostración.

## 📝 Ejemplo de Uso

1. Abre http://localhost:5173
2. Inicia sesión con cualquier credencial
3. La matriz de ejemplo ya está cargada: `[[12, -51, 4], [6, 167, -68], [-4, 24, -41]]`
4. Haz clic en "Calculate QR"
5. Visualiza los resultados: matrices Q y R, y estadísticas

## 🛠️ Desarrollo Local (sin Docker)

### API Go
```bash
cd go-api
go mod download
go run cmd/main.go
```

### API Node.js
```bash
cd node-api
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🧪 Ejecutar Tests

### Tests Go
```bash
cd go-api
go test ./...
```

### Tests específicos de QR (útiles para reproducir el caso resuelto)

```bash
cd go-api
go test ./internal/services -v -run TestComputeQR
```

> Nota: se corrigió un comportamiento en `ComputeQR` para matrices rectangulares y se añadieron tests para cubrir esos casos.

### Tests Node.js
```bash
cd node-api
npm test
```

## 📊 Verificar Salud de los Servicios

```bash
# API Go
curl http://localhost:8080/health

# API Node.js
curl http://localhost:3000/health
```

