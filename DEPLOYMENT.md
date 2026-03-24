# Guía de Despliegue - CotizadorVBO Backend

## 📦 Requisitos del Servidor

- Node.js 18+ 
- PostgreSQL 14+
- Memoria RAM: mínimo 512MB
- Espacio en disco: 1GB

## 🚀 Despliegue en Producción

### 1. Preparar el Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2
```

### 2. Configurar PostgreSQL

```bash
# Acceder a PostgreSQL
sudo -u postgres psql

# Crear base de datos y usuario
CREATE DATABASE cotizador_vbo;
CREATE USER vbo_user WITH ENCRYPTED PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE cotizador_vbo TO vbo_user;
\q
```

### 3. Clonar y Configurar Proyecto

```bash
# Clonar repositorio
git clone <tu-repositorio>
cd backend

# Instalar dependencias
npm install --production

# Configurar variables de entorno
cp .env.example .env
nano .env
```

### 4. Configurar .env para Producción

```env
NODE_ENV=production
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=cotizador_vbo
DB_USER=vbo_user
DB_PASSWORD=tu_password_seguro

JWT_SECRET=genera_un_secret_muy_largo_y_aleatorio_aqui
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password
EMAIL_FROM=noreply@virtualbackoffice.cl

FRONTEND_URL=https://virtualbackoffice.cl
```

### 5. Ejecutar Migraciones

```bash
npm run migrate
npm run seed  # Opcional: datos de prueba
```

### 6. Iniciar con PM2

```bash
# Iniciar aplicación
pm2 start src/server.js --name cotizador-api

# Configurar inicio automático
pm2 startup
pm2 save

# Ver logs
pm2 logs cotizador-api

# Monitorear
pm2 monit
```

## 🔒 Configurar Nginx (Reverse Proxy)

```bash
# Instalar Nginx
sudo apt install -y nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/cotizador-api
```

Contenido del archivo:

```nginx
server {
    listen 80;
    server_name api.virtualbackoffice.cl;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activar sitio
sudo ln -s /etc/nginx/sites-available/cotizador-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔐 Configurar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d api.virtualbackoffice.cl

# Renovación automática (ya configurada)
sudo certbot renew --dry-run
```

## 📊 Monitoreo y Logs

```bash
# Ver logs de PM2
pm2 logs cotizador-api

# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Ver estado de servicios
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
```

## 🔄 Actualizar Aplicación

```bash
# Detener aplicación
pm2 stop cotizador-api

# Actualizar código
git pull origin main

# Instalar dependencias
npm install --production

# Ejecutar migraciones si hay cambios
npm run migrate

# Reiniciar aplicación
pm2 restart cotizador-api
```

## 🛡️ Seguridad

1. **Firewall**:
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

2. **Fail2ban** (protección contra ataques):
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
```

3. **Backups de Base de Datos**:
```bash
# Crear script de backup
nano ~/backup-db.sh
```

Contenido:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U vbo_user cotizador_vbo > /backups/cotizador_$DATE.sql
find /backups -name "cotizador_*.sql" -mtime +7 -delete
```

```bash
chmod +x ~/backup-db.sh

# Agregar a crontab (diario a las 2 AM)
crontab -e
# Agregar: 0 2 * * * /home/usuario/backup-db.sh
```

## 📈 Optimización

1. **Compresión Gzip** (ya incluida en el código)
2. **Rate Limiting** (considerar agregar)
3. **Caché de Redis** (opcional para mejor rendimiento)

## 🆘 Troubleshooting

### Error de conexión a base de datos
```bash
# Verificar PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT version();"
```

### Puerto en uso
```bash
# Ver qué usa el puerto 3000
sudo lsof -i :3000
# Matar proceso si es necesario
kill -9 <PID>
```

### Memoria insuficiente
```bash
# Aumentar swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## 📞 Soporte

Para problemas o dudas, contactar a: soporte@virtualbackoffice.cl
