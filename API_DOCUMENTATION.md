# Documentación API - CotizadorVBO

Base URL: `http://localhost:3000/api`

## 🔐 Autenticación

Todas las rutas (excepto login y register) requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

---

## 📝 Auth Endpoints

### POST /auth/register
Registrar nuevo usuario

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "vendedor"
}
```

**Response:**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "vendedor"
  },
  "token": "jwt_token"
}
```

### POST /auth/login
Iniciar sesión

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

### GET /auth/profile
Obtener perfil del usuario autenticado

### PUT /auth/profile
Actualizar perfil

---

## 📋 Quotations Endpoints

### POST /quotations
Crear nueva cotización

**Body:**
```json
{
  "clientId": "uuid",
  "issueDate": "2024-03-24",
  "expirationDate": "2024-04-24",
  "currency": "CLP",
  "ivaPercentage": 19,
  "validity": "30 DÍAS",
  "paymentTerms": "50% anticipo, 50% contra entrega",
  "executionTime": "60 días",
  "notes": "Notas adicionales",
  "items": [
    {
      "code": "VBO-ID",
      "description": "Diseño de Identidad Visual",
      "quantity": 1,
      "quantityLabel": "1",
      "unitPrice": 15000,
      "subtotal": 15000
    }
  ]
}
```

### GET /quotations
Listar cotizaciones

**Query params:**
- `page`: número de página (default: 1)
- `limit`: items por página (default: 10)
- `status`: filtrar por estado (draft, sent, accepted, rejected, expired)
- `clientId`: filtrar por cliente
- `search`: buscar en número o notas

**Response:**
```json
{
  "quotations": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### GET /quotations/:id
Obtener cotización por ID

### PUT /quotations/:id
Actualizar cotización

### DELETE /quotations/:id
Eliminar cotización (solo admin)

### POST /quotations/:id/send-email
Enviar cotización por email

**Body:**
```json
{
  "recipientEmail": "cliente@example.com",
  "message": "Mensaje personalizado"
}
```

---

## 👥 Clients Endpoints

### POST /clients
Crear cliente

**Body:**
```json
{
  "name": "Empresa XYZ",
  "contactPerson": "Juan Pérez",
  "email": "contacto@empresa.com",
  "phone": "+56 9 1234 5678",
  "address": "Dirección completa",
  "taxId": "76.123.456-7",
  "notes": "Notas del cliente"
}
```

### GET /clients
Listar clientes

**Query params:**
- `page`, `limit`: paginación
- `search`: buscar por nombre, email o contacto
- `isActive`: filtrar activos/inactivos

### GET /clients/:id
Obtener cliente por ID (incluye últimas 10 cotizaciones)

### PUT /clients/:id
Actualizar cliente

### DELETE /clients/:id
Desactivar cliente (solo admin)

### GET /clients/:id/quotations
Obtener cotizaciones de un cliente

---

## 🛍️ Services Endpoints

### POST /services
Crear servicio (solo admin)

**Body:**
```json
{
  "code": "VBO-NEW",
  "name": "Nuevo Servicio",
  "description": "Descripción del servicio",
  "unitPrice": 10000,
  "currency": "CLP",
  "unit": "1",
  "categoryId": "uuid"
}
```

### GET /services
Listar servicios

**Query params:**
- `page`, `limit`: paginación
- `search`: buscar por nombre, código o descripción
- `categoryId`: filtrar por categoría
- `isActive`: filtrar activos/inactivos

### GET /services/:id
Obtener servicio por ID

### PUT /services/:id
Actualizar servicio (solo admin)

### DELETE /services/:id
Desactivar servicio (solo admin)

---

## 📊 Reports Endpoints

### GET /reports/dashboard
Obtener métricas del dashboard

**Query params:**
- `startDate`: fecha inicio (YYYY-MM-DD)
- `endDate`: fecha fin (YYYY-MM-DD)

**Response:**
```json
{
  "summary": {
    "totalQuotations": 150,
    "totalSales": 5000000,
    "conversionRate": 35.5,
    "quotationsByStatus": [...]
  },
  "topClients": [...],
  "quotationsByUser": [...]
}
```

### GET /reports/quotations-by-period
Cotizaciones agrupadas por período

**Query params:**
- `startDate`, `endDate`: rango de fechas
- `groupBy`: day, week, month

### GET /reports/top-services
Servicios más vendidos

**Query params:**
- `startDate`, `endDate`: rango de fechas
- `limit`: cantidad de resultados (default: 10)

---

## 🔑 Roles y Permisos

### Admin
- Acceso completo a todas las funcionalidades
- Puede eliminar cotizaciones y clientes
- Gestiona servicios y categorías
- Ve todas las cotizaciones del sistema

### Vendedor
- Crea y gestiona sus propias cotizaciones
- Acceso a clientes y servicios
- No puede eliminar
- Solo ve sus cotizaciones

### Viewer
- Solo lectura
- No puede crear ni modificar

---

## ⚠️ Códigos de Error

- `400`: Bad Request - Datos inválidos
- `401`: Unauthorized - Token inválido o no proporcionado
- `403`: Forbidden - Sin permisos
- `404`: Not Found - Recurso no encontrado
- `500`: Internal Server Error - Error del servidor

---

## 📌 Notas

1. Todos los endpoints de paginación retornan máximo 100 items por página
2. Las fechas deben estar en formato ISO (YYYY-MM-DD)
3. Los montos son decimales con 2 decimales
4. Los UUIDs son v4
5. Las búsquedas son case-insensitive

---

## 🧪 Ejemplos con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@virtualbackoffice.cl","password":"admin123"}'
```

### Crear Cotización
```bash
curl -X POST http://localhost:3000/api/quotations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @quotation.json
```

### Listar Cotizaciones
```bash
curl -X GET "http://localhost:3000/api/quotations?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
