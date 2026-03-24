# 🔧 Solución al Error de Conexión en Railway

## El Problema
El error `ECONNREFUSED` significa que el backend no puede conectarse a MySQL porque:
1. MySQL aún no está listo
2. Las variables de entorno no están configuradas
3. Falta la referencia entre servicios

## ✅ Solución Paso a Paso

### 1. Verificar que MySQL esté creado
En Railway:
1. Ve a tu proyecto
2. Deberías ver DOS servicios:
   - `backend_railway` (tu backend)
   - `MySQL` (la base de datos)

Si NO ves MySQL, créalo:
- Click "+ New" → Database → Add MySQL

### 2. Conectar Backend con MySQL (MUY IMPORTANTE)
Railway necesita que conectes explícitamente los servicios:

1. Click en tu servicio **backend_railway**
2. Ve a la pestaña **"Variables"**
3. Click en **"+ New Variable"** → **"Add Reference"**
4. Selecciona el servicio **MySQL**
5. Esto agregará automáticamente todas las variables necesarias:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

### 3. Verificar Variables de Entorno
Asegúrate de tener estas variables en tu servicio backend:

**Variables de MySQL (agregadas automáticamente al hacer la referencia):**
- ✅ `MYSQLHOST`
- ✅ `MYSQLPORT`
- ✅ `MYSQLDATABASE`
- ✅ `MYSQLUSER`
- ✅ `MYSQLPASSWORD`

**Variables que debes agregar manualmente:**
```
NODE_ENV=production
JWT_SECRET=cotizador_vbo_super_secret_key_2024_CAMBIAR
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5174
```

### 4. Cambiar el Start Command
1. Click en tu servicio backend
2. Ve a **"Settings"**
3. Busca **"Deploy"**
4. En **"Start Command"** pon:
```bash
npm run migrate && npm start
```
5. Click **"Save"**

### 5. Redeploy
1. Ve a **"Deployments"**
2. Click en los **"..."** del último deploy
3. Click **"Redeploy"**

### 6. Monitorear los Logs
Mientras se hace el deploy, ve a la pestaña **"Logs"** y deberías ver:

```
🔄 Intento 1/10 - Conectando a base de datos...
✅ Conexión establecida
✅ Tablas creadas/actualizadas
🎉 Migración completada exitosamente!
🚀 Servidor corriendo en puerto 3000
```

## 🎯 Alternativa: Separar Migración del Start

Si el problema persiste, cambia el Start Command a solo:
```bash
npm start
```

Y ejecuta las migraciones manualmente:
1. Ve a tu servicio backend
2. Click en **"..."** → **"Run Command"**
3. Ejecuta: `npm run migrate`

## ✅ Verificar que Funciona

Una vez que el deploy termine exitosamente:

1. Ve a **"Settings"** → **"Networking"**
2. Copia la URL pública
3. Abre en el navegador: `TU_URL/health`
4. Deberías ver: `{"status":"OK","timestamp":"..."}`

## 🐛 Si Aún No Funciona

### Opción 1: Revisar Logs Detallados
```bash
# En Railway, ve a Logs y busca:
- "Conexión establecida" ✅
- "Error en migración" ❌
```

### Opción 2: Verificar Conexión Manual
En Railway → Run Command:
```bash
node -e "console.log(process.env.MYSQLHOST)"
```
Debería mostrar el host de MySQL (no undefined)

### Opción 3: Recrear MySQL
Si nada funciona:
1. Elimina el servicio MySQL
2. Crea uno nuevo
3. Vuelve a hacer la referencia desde el backend
4. Redeploy

## 📞 Checklist Final

- [ ] MySQL está creado en Railway
- [ ] Backend tiene referencia a MySQL (variables MYSQL*)
- [ ] Variables NODE_ENV, JWT_SECRET están configuradas
- [ ] Start Command es: `npm run migrate && npm start`
- [ ] Deploy completado sin errores
- [ ] `/health` responde correctamente

---

**Nota:** El código ahora tiene retry logic (10 intentos con 3 segundos entre cada uno), así que debería conectarse automáticamente una vez que MySQL esté disponible.
