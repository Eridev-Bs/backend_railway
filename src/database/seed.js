import sequelize from '../config/database.js';
import { User, Client, Category, Service } from '../models/index.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Iniciando seed de base de datos...');

    // Crear usuario admin
    const admin = await User.create({
      name: 'Administrador',
      email: 'admin@virtualbackoffice.cl',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Usuario admin creado');

    // Crear vendedor
    const vendedor = await User.create({
      name: 'Vendedor Demo',
      email: 'vendedor@virtualbackoffice.cl',
      password: 'vendedor123',
      role: 'vendedor'
    });
    console.log('✅ Usuario vendedor creado');

    // Crear clientes de ejemplo
    const clients = await Client.bulkCreate([
      {
        name: 'SERVIT S.A. de C.V.',
        contactPerson: 'Ing. Laura Garcia',
        email: 'laura.garcia@servit.com',
        phone: '+52 55 1234 5678',
        address: 'Av. Insurgentes Sur 1200, CDMX, México',
        taxId: 'SER123456789'
      },
      {
        name: 'TechCorp Chile',
        contactPerson: 'Carlos Muñoz',
        email: 'carlos@techcorp.cl',
        phone: '+56 2 2345 6789',
        address: 'Av. Providencia 1234, Santiago, Chile',
        taxId: '76.123.456-7'
      },
      {
        name: 'Innovación Digital SpA',
        contactPerson: 'María González',
        email: 'maria@innovacion.cl',
        phone: '+56 9 8765 4321',
        address: 'Las Condes 567, Santiago, Chile',
        taxId: '77.987.654-3'
      }
    ]);
    console.log('✅ Clientes creados');

    // Crear categorías
    const categories = await Category.bulkCreate([
      { name: 'Diseño Gráfico', description: 'Servicios de diseño visual y branding' },
      { name: 'Desarrollo Web', description: 'Desarrollo de sitios y aplicaciones web' },
      { name: 'Marketing Digital', description: 'Campañas y estrategias de marketing online' },
      { name: 'Audiovisual', description: 'Producción de video y contenido multimedia' },
      { name: 'Consultoría', description: 'Asesoría estratégica y consultoría' }
    ]);
    console.log('✅ Categorías creadas');

    // Crear servicios
    const services = await Service.bulkCreate([
      {
        code: 'VBO-ID',
        name: 'Diseño de Identidad Visual',
        description: 'Diseño de Identidad Visual Completa (Logotipo, Guía de Marca)',
        unitPrice: 15000,
        currency: 'CLP',
        unit: '1',
        categoryId: categories[0].id
      },
      {
        code: 'VBO-WEB',
        name: 'Desarrollo Web Corporativo',
        description: 'Desarrollo de Sitio Web Corporativo Responsivo',
        unitPrice: 28000,
        currency: 'CLP',
        unit: '1',
        categoryId: categories[1].id
      },
      {
        code: 'VBO-MKT',
        name: 'Campaña Marketing Digital',
        description: 'Campaña de Marketing Digital (3 meses, Creación de Contenido y Gestión de Anuncios)',
        unitPrice: 35000,
        currency: 'CLP',
        unit: '1 Paquete',
        categoryId: categories[2].id
      },
      {
        code: 'VBO-VID',
        name: 'Video Corporativo',
        description: 'Producción de Video Corporativo de Alta Calidad (2 mins)',
        unitPrice: 22000,
        currency: 'CLP',
        unit: '1',
        categoryId: categories[3].id
      },
      {
        code: 'VBO-CONS',
        name: 'Consultoría Estratégica',
        description: 'Consultoría Estratégica Mensual (Asesoría Visual y de Marca)',
        unitPrice: 8000,
        currency: 'CLP',
        unit: 'Mes',
        categoryId: categories[4].id
      }
    ]);
    console.log('✅ Servicios creados');

    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📝 Credenciales de acceso:');
    console.log('Admin: admin@virtualbackoffice.cl / admin123');
    console.log('Vendedor: vendedor@virtualbackoffice.cl / vendedor123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedDatabase();
