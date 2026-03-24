# 🚀 Inicio Rápido - CotizadorVBO Backend

## Instalación en 5 minutos

### 1️⃣ Instalar PostgreSQL

**Windows:**
- Descargar desde: https://www.postgresql.org/download/windows/
- Instalar con contraseña: `postgres`

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2️⃣ Crear Base de Datos

```bash
# Acceder a PostgreSQL
psql -U postgres

# Dentro de psql:
CREATE DATABASE cotizador_vbo;
\q
```

### 3️⃣ Instalar Dependencias

```bash
cd backend
npm install
```

### 4️⃣ Configurar Variables de Entorno

El archivo `.env` ya está creado con valores por defecto. Si usas otra contraseña de PostgreSQL, edítalo:

```bash
# Editar si es necesario
nano .env
```

### 5️⃣ Ejecutar Migraciones y Seed

```bash
# Crear tablas
npm run migrate

# Cargar datos de prueba
npm run seed
```

### 6️⃣ Iniciar Servidor

```bash
npm run dev
```

El servidor estará corriendo en: **http://localhost:3000**

---

## ✅ Verificar Instalación

### Test de Health Check
```bash
curl http://localhost:3000/health
```

Deberías ver:
```json
{"status":"OK","timestamp":"2024-03-24T..."}
```

### Test de Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@virtualbackoffice.cl","password":"admin123"}'
```

---

## 👤 Usuarios de Prueba

Después de ejecutar `npm run seed`:

**Administrador:**
- Email: `admin@virtualbackoffice.cl`
- Password: `admin123`

**Vendedor:**
- Email: `vendedor@virtualbackoffice.cl`
- Password: `vendedor123`

---

## 📚 Próximos Pasos

1. **Leer la documentación de API**: `API_DOCUMENTATION.md`
2. **Probar endpoints** con Postman o Thunder Client
3. **Integrar con el frontend** Vue.js
4. **Configurar email** para envío de cotizaciones

---

## 🐛 Problemas Comunes

### Error: "database does not exist"
```bash
psql -U postgres -c "CREATE DATABASE cotizador_vbo;"
```

### Error: "password authentication failed"
Edita `.env` y cambia `DB_PASSWORD` por tu contraseña de PostgreSQL

### Error: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Ayuda

Si tienes problemas, revisa:
1. `README.md` - Documentación completa
2. `API_DOCUMENTATION.md` - Endpoints disponibles
3. `DEPLOYMENT.md` - Guía de despliegue

---

## 🎉 ¡Listo!

Tu backend está funcionando. Ahora puedes:
- Crear cotizaciones desde el frontend
- Gestionar clientes
- Ver reportes
- Enviar emails

**API Base URL:** `http://localhost:3000/api`
