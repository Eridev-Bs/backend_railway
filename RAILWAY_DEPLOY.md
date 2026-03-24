# Deploy en Railway.app

## Pasos para Deploy

### 1. Crear cuenta en Railway
- Ve a https://railway.app
- Regístrate con GitHub

### 2. Crear nuevo proyecto
1. Click en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Conecta tu repositorio
4. Selecciona la carpeta `backend`

### 3. Agregar Base de Datos MySQL
1. En tu proyecto, click en "+ New"
2. Selecciona "Database" → "Add MySQL"
3. Railway creará automáticamente la base de datos

### 4. Configurar Variables de Entorno

Railway detectará automáticamente las variables de MySQL. Solo necesitas agregar estas adicionales:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=tu_secreto_super_seguro_cambialo_en_produccion
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-frontend.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_app
EMAIL_FROM=noreply@virtualbackoffice.cl
```

**Importante:** Railway automáticamente provee estas variables para MySQL:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`

### 5. Actualizar configuración de base de datos

El archivo `src/config/database.js` ya está configurado para usar las variables de Railway.

### 6. Deploy

1. Railway hará deploy automáticamente
2. Espera a que termine el build
3. Una vez completado, ejecuta las migraciones:
   - Ve a la pestaña "Settings"
   - En "Deploy" → "Custom Start Command" agrega:
     ```
     npm run migrate && npm start
     ```

### 7. Ejecutar Seed (Opcional)

Para cargar datos de prueba:
1. Ve a la pestaña de tu servicio
2. Click en "..." → "Run Command"
3. Ejecuta: `npm run seed`

### 8. Obtener URL del Backend

Railway te dará una URL pública como:
```
https://tu-proyecto.up.railway.app
```

Usa esta URL en tu frontend para conectar con el backend.

## Notas Importantes

- Railway tiene $5 de crédito gratis al mes
- El servicio NO se duerme (a diferencia de Render)
- Los logs están disponibles en tiempo real
- Puedes configurar dominios personalizados

## Troubleshooting

### Error de conexión a MySQL
Verifica que las variables de entorno estén correctamente configuradas.

### Error en migraciones
Ejecuta manualmente desde la consola de Railway:
```bash
npm run migrate
```

### Ver logs
En Railway, ve a la pestaña "Deployments" y click en el último deploy para ver los logs.
