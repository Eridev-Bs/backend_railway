# CotizadorVBO Backend API

Backend API para el sistema de cotizaciones Virtual Back Office.

## 🚀 Tecnologías

- Node.js + Express
- MySQL + Sequelize ORM
- JWT Authentication
- Nodemailer para emails

## 📋 Requisitos Locales

- Node.js 18+
- MySQL 8+
- npm

## 🔧 Instalación Local

1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

3. Crear base de datos MySQL:
```sql
CREATE DATABASE cotizador_vbo;
```

4. Ejecutar migraciones:
```bash
npm run migrate
```

5. (Opcional) Cargar datos de prueba:
```bash
npm run seed
```

## 🏃 Ejecución Local

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

La API estará disponible en: `http://localhost:3000`

## ☁️ Deploy en Railway

Para deploy en Railway.app, sigue las instrucciones en:
- [QUICK_RAILWAY_SETUP.md](./QUICK_RAILWAY_SETUP.md) - Setup rápido
- [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) - Guía completa

## 📚 Documentación API

Ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para detalles de los endpoints.

## 🔐 Credenciales de Prueba

Después de ejecutar el seed:
- Admin: `admin@virtualbackoffice.cl` / `admin123`
- Vendedor: `vendedor@virtualbackoffice.cl` / `vendedor123`

## 📝 Licencia

Desarrollado para Virtual Back Office
