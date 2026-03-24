# Setup Rápido en Railway 🚀

## 1. Crear Proyecto en Railway
1. Ve a https://railway.app
2. Login con GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio

## 2. Agregar MySQL
1. En el proyecto, click "+ New"
2. Selecciona "Database" → "Add MySQL"

## 3. Variables de Entorno Necesarias

Railway auto-configura MySQL. Solo agrega estas:

```env
NODE_ENV=production
JWT_SECRET=cambia_este_secreto_por_uno_seguro
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-frontend-url.vercel.app
```

## 4. Configurar Start Command

En Settings → Deploy → Custom Start Command:
```bash
npm run migrate && npm start
```

## 5. Deploy
Railway hace deploy automáticamente. ¡Listo!

## 6. Cargar Datos de Prueba (Opcional)

En la consola de Railway:
```bash
npm run seed
```

## Tu URL del Backend
Railway te dará una URL como:
```
https://tu-proyecto.up.railway.app
```

Úsala en tu frontend para la variable `VITE_API_URL`.

---

## Costos
- $5 USD gratis al mes
- Suficiente para desarrollo y proyectos pequeños
- No se duerme como Render

## Soporte
Si tienes problemas, revisa los logs en Railway → Deployments → [último deploy]
