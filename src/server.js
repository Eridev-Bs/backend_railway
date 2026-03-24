import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import './models/index.js';

// Routes
import authRoutes from './routes/auth.js';
import quotationRoutes from './routes/quotations.js';
import clientRoutes from './routes/clients.js';
import serviceRoutes from './routes/services.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir múltiples orígenes
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL
].filter(Boolean);

// Middlewares
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (como mobile apps o curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Database connection and server start
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const startServer = async () => {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`🔄 Intento ${retries + 1}/${maxRetries} - Conectando a base de datos...`);
      
      await sequelize.authenticate();
      console.log('✅ Conexión a base de datos establecida');

      // Sync database (solo en desarrollo)
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('✅ Modelos sincronizados');
      }

      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        console.log(`📝 Ambiente: ${process.env.NODE_ENV}`);
      });
      
      return; // Salir del loop si la conexión fue exitosa
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        console.error('❌ Error al iniciar servidor después de múltiples intentos:', error.message);
        console.error('💡 Verifica que:');
        console.error('   1. La base de datos MySQL esté creada en Railway');
        console.error('   2. Las variables MYSQL* estén configuradas');
        console.error('   3. El servicio MySQL esté corriendo');
        process.exit(1);
      }
      console.log(`⏳ Esperando 3 segundos antes de reintentar...`);
      await sleep(3000);
    }
  }
};

startServer();

export default app;
