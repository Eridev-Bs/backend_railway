import sequelize from '../config/database.js';
import '../models/index.js';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const migrate = async () => {
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log(`🔄 Intento ${retries + 1}/${maxRetries} - Conectando a base de datos...`);

      await sequelize.authenticate();
      console.log('✅ Conexión establecida');

      await sequelize.sync({ force: false, alter: true });
      console.log('✅ Tablas creadas/actualizadas');

      console.log('\n🎉 Migración completada exitosamente!');
      process.exit(0);
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        console.error('❌ Error en migración después de múltiples intentos:', error.message);
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

migrate();
