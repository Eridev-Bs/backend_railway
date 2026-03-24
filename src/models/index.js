import User from './User.js';
import Client from './Client.js';
import Category from './Category.js';
import Service from './Service.js';
import Quotation from './Quotation.js';
import QuotationItem from './QuotationItem.js';
import Notification from './Notification.js';

// Relaciones

// User - Quotation (Un usuario crea muchas cotizaciones)
User.hasMany(Quotation, { foreignKey: 'userId', as: 'quotations' });
Quotation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Client - Quotation (Un cliente tiene muchas cotizaciones)
Client.hasMany(Quotation, { foreignKey: 'clientId', as: 'quotations' });
Quotation.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Quotation - QuotationItem (Una cotización tiene muchos items)
Quotation.hasMany(QuotationItem, { foreignKey: 'quotationId', as: 'items', onDelete: 'CASCADE' });
QuotationItem.belongsTo(Quotation, { foreignKey: 'quotationId', as: 'quotation' });

// Category - Service (Una categoría tiene muchos servicios)
Category.hasMany(Service, { foreignKey: 'categoryId', as: 'services' });
Service.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Service - QuotationItem (Relación opcional para tracking)
Service.hasMany(QuotationItem, { foreignKey: 'serviceId', as: 'quotationItems' });
QuotationItem.belongsTo(Service, { foreignKey: 'serviceId', as: 'service' });

// User - Notification (Un usuario tiene muchas notificaciones)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Quotation - Notification (Una cotización puede generar notificaciones)
Quotation.hasMany(Notification, { foreignKey: 'quotationId', as: 'notifications' });
Notification.belongsTo(Quotation, { foreignKey: 'quotationId', as: 'quotation' });

export {
  User,
  Client,
  Category,
  Service,
  Quotation,
  QuotationItem,
  Notification
};
