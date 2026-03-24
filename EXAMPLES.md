# 📝 Ejemplos de Uso - CotizadorVBO API

## Flujo Completo: Crear una Cotización

### 1. Login y obtener token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@virtualbackoffice.cl",
    "password": "admin123"
  }'
```

**Respuesta:**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": "uuid",
    "name": "Administrador",
    "email": "admin@virtualbackoffice.cl",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Guarda el `token` para usarlo en las siguientes peticiones.

---

### 2. Listar Clientes

```bash
curl -X GET http://localhost:3000/api/clients \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta:**
```json
{
  "clients": [
    {
      "id": "uuid-1",
      "name": "SERVIT S.A. de C.V.",
      "contactPerson": "Ing. Laura Garcia",
      "email": "laura.garcia@servit.com",
      "phone": "+52 55 1234 5678"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### 3. Listar Servicios Disponibles

```bash
curl -X GET http://localhost:3000/api/services \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta:**
```json
{
  "services": [
    {
      "id": "uuid-1",
      "code": "VBO-ID",
      "name": "Diseño de Identidad Visual",
      "unitPrice": "15000.00",
      "currency": "CLP"
    },
    {
      "id": "uuid-2",
      "code": "VBO-WEB",
      "name": "Desarrollo Web Corporativo",
      "unitPrice": "28000.00",
      "currency": "CLP"
    }
  ]
}
```

---

### 4. Crear Nueva Cotización

```bash
curl -X POST http://localhost:3000/api/quotations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "clientId": "uuid-del-cliente",
    "issueDate": "2024-03-24",
    "expirationDate": "2024-04-24",
    "currency": "CLP",
    "ivaPercentage": 19,
    "validity": "30 DÍAS",
    "paymentTerms": "50% anticipo, 50% contra entrega",
    "executionTime": "60 días",
    "notes": "Cotización para proyecto de branding completo",
    "items": [
      {
        "code": "VBO-ID",
        "description": "Diseño de Identidad Visual Completa (Logotipo, Guía de Marca)",
        "quantity": 1,
        "quantityLabel": "1",
        "unitPrice": 15000,
        "subtotal": 15000
      },
      {
        "code": "VBO-WEB",
        "description": "Desarrollo de Sitio Web Corporativo Responsivo",
        "quantity": 1,
        "quantityLabel": "1",
        "unitPrice": 28000,
        "subtotal": 28000
      }
    ]
  }'
```

**Respuesta:**
```json
{
  "message": "Cotización creada exitosamente",
  "quotation": {
    "id": "uuid-cotizacion",
    "quoteNumber": "COT-VBO-0001",
    "issueDate": "2024-03-24",
    "expirationDate": "2024-04-24",
    "status": "draft",
    "currency": "CLP",
    "subtotal": "43000.00",
    "ivaPercentage": "19.00",
    "ivaAmount": "8170.00",
    "total": "51170.00",
    "client": {
      "name": "SERVIT S.A. de C.V.",
      "email": "laura.garcia@servit.com"
    },
    "items": [...]
  }
}
```

---

### 5. Enviar Cotización por Email

```bash
curl -X POST http://localhost:3000/api/quotations/uuid-cotizacion/send-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "recipientEmail": "laura.garcia@servit.com",
    "message": "Estimada Laura, adjuntamos la cotización solicitada para su revisión."
  }'
```

**Respuesta:**
```json
{
  "message": "Cotización enviada por email"
}
```

---

### 6. Ver Dashboard de Reportes

```bash
curl -X GET "http://localhost:3000/api/reports/dashboard?startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta:**
```json
{
  "summary": {
    "totalQuotations": 25,
    "totalSales": 5000000,
    "conversionRate": 40.5,
    "quotationsByStatus": [
      {
        "status": "accepted",
        "count": 10,
        "totalAmount": "5000000.00"
      },
      {
        "status": "sent",
        "count": 8,
        "totalAmount": "3200000.00"
      }
    ]
  },
  "topClients": [...],
  "quotationsByUser": [...]
}
```

---

## Ejemplos con JavaScript (Fetch)

### Login
```javascript
const login = async () => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: 'admin@virtualbackoffice.cl',
      password: 'admin123'
    })
  });
  
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
};
```

### Crear Cotización
```javascript
const createQuotation = async (quotationData) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/api/quotations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(quotationData)
  });
  
  return await response.json();
};
```

### Listar Cotizaciones
```javascript
const getQuotations = async (page = 1, limit = 10) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(
    `http://localhost:3000/api/quotations?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  
  return await response.json();
};
```

---

## Ejemplos con Axios (Vue.js)

### Configurar Axios
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Usar en componentes
```javascript
// En tu componente Vue
import api from '@/services/api';

export default {
  methods: {
    async createQuotation(data) {
      try {
        const response = await api.post('/quotations', data);
        console.log('Cotización creada:', response.data);
      } catch (error) {
        console.error('Error:', error.response.data);
      }
    },
    
    async getClients() {
      try {
        const response = await api.get('/clients');
        this.clients = response.data.clients;
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
};
```

---

## Casos de Uso Comunes

### Buscar Cotizaciones
```bash
# Por estado
curl -X GET "http://localhost:3000/api/quotations?status=sent" \
  -H "Authorization: Bearer TOKEN"

# Por cliente
curl -X GET "http://localhost:3000/api/quotations?clientId=uuid" \
  -H "Authorization: Bearer TOKEN"

# Búsqueda de texto
curl -X GET "http://localhost:3000/api/quotations?search=VBO-0001" \
  -H "Authorization: Bearer TOKEN"
```

### Actualizar Estado de Cotización
```bash
curl -X PUT http://localhost:3000/api/quotations/uuid \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "status": "accepted"
  }'
```

### Obtener Historial de Cliente
```bash
curl -X GET http://localhost:3000/api/clients/uuid/quotations \
  -H "Authorization: Bearer TOKEN"
```

---

## Testing con Jest

```javascript
describe('Quotations API', () => {
  let token;
  
  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@virtualbackoffice.cl',
        password: 'admin123'
      });
    token = response.body.token;
  });
  
  test('should create quotation', async () => {
    const response = await request(app)
      .post('/api/quotations')
      .set('Authorization', `Bearer ${token}`)
      .send(quotationData);
    
    expect(response.status).toBe(201);
    expect(response.body.quotation).toHaveProperty('quoteNumber');
  });
});
```

---

## 💡 Tips

1. **Siempre incluye el token** en el header Authorization
2. **Maneja errores** apropiadamente (401, 403, 404, 500)
3. **Usa paginación** para listas grandes
4. **Valida datos** antes de enviar
5. **Guarda el token** de forma segura (localStorage, cookies)

---

## 🔗 Recursos Adicionales

- [Postman Collection](./postman_collection.json)
- [API Documentation](./API_DOCUMENTATION.md)
- [Quick Start Guide](./QUICK_START.md)
