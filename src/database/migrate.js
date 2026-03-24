import sequelize from '../config/database.js';
import '../models/index.js';

const migrate = async () => {
  try {
    console.log('🔄 Iniciando migración de base de datos...');

    await sequelize.authenticate();
    console.log('✅ Conexión establecida');

    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Tablas creadas/actualizadas');

    console.log('\n🎉 Migración completada exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  }
};

migrate();
