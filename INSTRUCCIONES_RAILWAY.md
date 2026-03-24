# ✅ Backend Subido a GitHub

Repositorio: https://github.com/Eridev-Bs/backend_railway

## 🚀 Próximos Pasos para Deploy en Railway

### 1. Ir a Railway.app
Ve a: https://railway.app

### 2. Login con GitHub
- Click en "Login"
- Selecciona "Login with GitHub"

### 3. Crear Nuevo Proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona: `Eridev-Bs/backend_railway`
4. Click en "Deploy Now"

### 4. Agregar Base de Datos MySQL
1. En tu proyecto, click en "+ New"
2. Selecciona "Database"
3. Click en "Add MySQL"
4. Espera a que se cree (toma ~30 segundos)

### 5. Configurar Variables de Entorno
Railway auto-configura las variables de MySQL. Solo necesitas agregar estas:

1. Click en tu servicio backend
2. Ve a la pestaña "Variables"
3. Agrega estas variables:

```
NODE_ENV=production
JWT_SECRET=cotizador_vbo_super_secret_key_2024_CAMBIAR_EN_PRODUCCION
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5174
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_app
EMAIL_FROM=noreply@virtualbackoffice.cl
```

### 6. Configurar Start Command (Importante)
1. Click en tu servicio backend
2. Ve a "Settings"
3. Busca "Deploy"
4. En "Custom Start Command" escribe:
```bash
npm run migrate && npm start
```
5. Click "Save"

### 7. Redeploy
1. Ve a "Deployments"
2. Click en "..." del último deploy
3. Click "Redeploy"

### 8. Verificar que Funciona
1. Espera a que termine el deploy (~2-3 minutos)
2. Ve a "Settings" → "Networking"
3. Copia la URL pública (algo como: `https://backend-railway-production-xxxx.up.railway.app`)
4. Prueba en el navegador: `TU_URL/api/auth/login`

### 9. Cargar Datos de Prueba (Opcional)
1. En Railway, click en tu servicio
2. Ve a la pestaña "..." → "Run Command"
3. Ejecuta: `npm run seed`

### 10. Actualizar Frontend
En tu proyecto `frontend-new`, crea o actualiza el archivo `.env`:

```env
VITE_API_URL=https://tu-url-de-railway.up.railway.app/api
```

## 🎉 ¡Listo!

Tu backend está corriendo en Railway. Ahora puedes:
- Ver logs en tiempo real
- Monitorear uso de recursos
- Configurar dominios personalizados
- Escalar si es necesario

## 💰 Costos
- $5 USD gratis al mes
- Suficiente para ~500 horas de uso
- No se duerme (siempre disponible)

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Verifica que MySQL esté creado
- Revisa que las variables de entorno estén configuradas

### Error: "Module not found"
- Asegúrate de que `npm install` se ejecutó correctamente
- Revisa los logs en Railway

### Error en migraciones
- Ejecuta manualmente: `npm run migrate` desde la consola de Railway

## 📞 Soporte
Si tienes problemas:
1. Revisa los logs en Railway → Deployments → [último deploy]
2. Verifica las variables de entorno
3. Asegúrate de que MySQL esté corriendo

---

**Repositorio Backend:** https://github.com/Eridev-Bs/backend_railway
**Railway Dashboard:** https://railway.app/dashboard
