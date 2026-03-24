# 🔗 Integración Frontend - CotizadorVBO

Guía para conectar el frontend Vue.js con el backend.

---

## 📦 Instalación en Frontend

```bash
cd ..  # Volver a la raíz del proyecto
npm install axios
```

---

## 🔧 Configuración

### 1. Crear servicio de API

Crear archivo `src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. Crear store de autenticación

Actualizar `src/stores/auth.js`:

```javascript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  async function login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', token.value);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  }

  async function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  }

  async function fetchProfile() {
    try {
      const response = await api.get('/auth/profile');
      user.value = response.data.user;
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchProfile
  };
});
```

### 3. Actualizar store de cotizaciones

Modificar `src/stores/quotation.js` para usar el backend:

```javascript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useQuotationStore = defineStore('quotation', () => {
  // Estado local para edición
  const client = ref({
    name: '',
    attention: '',
    address: '',
    date: new Date().toLocaleDateString('es-CL'),
    expirationDate: '',
    quoteNumber: ''
  });

  const company = ref({
    phone: '+56 9 3904 0361',
    email: 'darling.ugarte@virtualbackoffice.cl',
    web: 'www.virtualbackoffice.cl'
  });

  const services = ref([]);
  const terms = ref({
    validity: '30 DÍAS',
    paymentTerms: '50% anticipo, 50% contra entrega.',
    executionTime: '60 días'
  });

  const currency = ref('CLP');
  const ivaPercentage = ref(19);

  // Computed
  const subtotal = computed(() => {
    return services.value.reduce((acc, curr) => acc + curr.subtotal, 0);
  });

  const iva = computed(() => {
    return subtotal.value * (ivaPercentage.value / 100);
  });

  const total = computed(() => {
    return subtotal.value + iva.value;
  });

  const currencySymbol = computed(() => {
    const symbols = {
      'CLP': '$',
      'USD': 'US$',
      'UF': 'UF',
      'UTM': 'UTM'
    };
    return symbols[currency.value] || '$';
  });

  // Acciones con API
  async function saveQuotation(clientId) {
    try {
      const response = await api.post('/quotations', {
        clientId,
        issueDate: client.value.date,
        expirationDate: client.value.expirationDate,
        currency: currency.value,
        ivaPercentage: ivaPercentage.value,
        validity: terms.value.validity,
        paymentTerms: terms.value.paymentTerms,
        executionTime: terms.value.executionTime,
        items: services.value.map(item => ({
          code: item.id,
          description: item.description,
          quantity: item.qty,
          quantityLabel: item.qtyLabel,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal
        }))
      });

      client.value.quoteNumber = response.data.quotation.quoteNumber;
      return { success: true, quotation: response.data.quotation };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  }

  async function loadQuotation(id) {
    try {
      const response = await api.get(`/quotations/${id}`);
      const q = response.data.quotation;

      client.value = {
        name: q.client.name,
        attention: q.client.contactPerson,
        address: q.client.address,
        date: q.issueDate,
        expirationDate: q.expirationDate,
        quoteNumber: q.quoteNumber
      };

      services.value = q.items.map(item => ({
        id: item.code,
        description: item.description,
        qty: item.quantity,
        qtyLabel: item.quantityLabel,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      }));

      currency.value = q.currency;
      ivaPercentage.value = q.ivaPercentage;
      terms.value = {
        validity: q.validity,
        paymentTerms: q.paymentTerms,
        executionTime: q.executionTime
      };

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  }

  function updateService(index, field, value) {
    services.value[index][field] = value;
    services.value[index].subtotal = services.value[index].qty * services.value[index].unitPrice;
  }

  function addService() {
    services.value.push({
      id: `VBO-${services.value.length + 1}`,
      description: 'Nuevo Servicio',
      qty: 1,
      qtyLabel: '1',
      unitPrice: 0,
      subtotal: 0
    });
  }

  function removeService(index) {
    services.value.splice(index, 1);
  }

  function resetQuotation() {
    client.value = {
      name: '',
      attention: '',
      address: '',
      date: new Date().toLocaleDateString('es-CL'),
      expirationDate: '',
      quoteNumber: ''
    };
    services.value = [];
  }

  return {
    client,
    company,
    services,
    terms,
    currency,
    ivaPercentage,
    subtotal,
    iva,
    total,
    currencySymbol,
    updateService,
    addService,
    removeService,
    resetQuotation,
    saveQuotation,
    loadQuotation
  };
});
```

### 4. Crear servicio de clientes

Crear `src/services/clientService.js`:

```javascript
import api from './api';

export const clientService = {
  async getAll(params = {}) {
    const response = await api.get('/clients', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  async create(clientData) {
    const response = await api.post('/clients', clientData);
    return response.data;
  },

  async update(id, clientData) {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  async search(query) {
    const response = await api.get('/clients', {
      params: { search: query }
    });
    return response.data;
  }
};
```

### 5. Crear servicio de servicios

Crear `src/services/serviceService.js`:

```javascript
import api from './api';

export const serviceService = {
  async getAll(params = {}) {
    const response = await api.get('/services', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/services/${id}`);
    return response.data;
  }
};
```

---

## 🔄 Actualizar Componentes

### Agregar selector de cliente

En `src/App.vue`, agregar antes de la información del cliente:

```vue
<div class="mb-4 print:hidden">
  <label class="block text-sm font-bold text-gray-700 mb-2">
    Seleccionar Cliente
  </label>
  <select 
    v-model="selectedClientId"
    @change="loadClientData"
    class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#001B48] outline-none"
  >
    <option value="">-- Nuevo Cliente --</option>
    <option 
      v-for="client in clients" 
      :key="client.id" 
      :value="client.id"
    >
      {{ client.name }}
    </option>
  </select>
</div>
```

Agregar en el script:

```javascript
import { clientService } from './services/clientService';

const clients = ref([]);
const selectedClientId = ref('');

onMounted(async () => {
  const response = await clientService.getAll();
  clients.value = response.clients;
});

const loadClientData = async () => {
  if (!selectedClientId.value) return;
  
  const response = await clientService.getById(selectedClientId.value);
  const client = response.client;
  
  store.client.name = client.name;
  store.client.attention = client.contactPerson;
  store.client.address = client.address;
};
```

### Botón para guardar cotización

```vue
<button 
  @click="saveQuotation"
  class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
>
  Guardar Cotización
</button>
```

```javascript
const saveQuotation = async () => {
  if (!selectedClientId.value) {
    alert('Selecciona un cliente primero');
    return;
  }

  const result = await store.saveQuotation(selectedClientId.value);
  
  if (result.success) {
    alert('Cotización guardada exitosamente');
  } else {
    alert('Error: ' + result.error);
  }
};
```

---

## 🌐 Variables de Entorno

Crear `.env` en la raíz del frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

Para producción:

```env
VITE_API_URL=https://api.virtualbackoffice.cl/api
```

---

## 🔐 Proteger Rutas

Crear `src/router/index.js`:

```javascript
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    component: () => import('@/App.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
```

---

## 📝 Ejemplo Completo de Flujo

1. Usuario hace login
2. Se guarda el token
3. Usuario selecciona un cliente
4. Se cargan los datos del cliente
5. Usuario agrega servicios
6. Usuario guarda la cotización
7. Backend genera número correlativo
8. Se muestra la cotización guardada

---

## 🧪 Testing

```javascript
// tests/quotation.spec.js
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useQuotationStore } from '@/stores/quotation';

describe('Quotation Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('calculates subtotal correctly', () => {
    const store = useQuotationStore();
    store.services = [
      { qty: 2, unitPrice: 1000, subtotal: 2000 },
      { qty: 1, unitPrice: 500, subtotal: 500 }
    ];
    
    expect(store.subtotal).toBe(2500);
  });

  it('calculates IVA correctly', () => {
    const store = useQuotationStore();
    store.services = [{ qty: 1, unitPrice: 1000, subtotal: 1000 }];
    store.ivaPercentage = 19;
    
    expect(store.iva).toBe(190);
  });
});
```

---

## 🚀 Despliegue

Actualizar `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [vue()],
  base: '/CotizadorVBO/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
```

---

## ✅ Checklist de Integración

- [ ] Instalar axios
- [ ] Crear servicio de API
- [ ] Crear store de autenticación
- [ ] Actualizar store de cotizaciones
- [ ] Crear servicios de clientes y servicios
- [ ] Agregar selector de clientes
- [ ] Agregar botón de guardar
- [ ] Configurar variables de entorno
- [ ] Proteger rutas
- [ ] Probar flujo completo
- [ ] Agregar manejo de errores
- [ ] Agregar loading states

---

## 📞 Soporte

Si tienes problemas con la integración:
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador
3. Verifica el token en localStorage
4. Revisa los logs del backend

¡Listo para integrar! 🎉
