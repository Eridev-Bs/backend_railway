import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Quotation = sequelize.define('Quotation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quoteNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  issueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'accepted', 'rejected', 'expired'),
    defaultValue: 'draft'
  },
  currency: {
    type: DataTypes.ENUM('CLP', 'USD', 'UF', 'UTM'),
    defaultValue: 'CLP'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  ivaPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 19.00
  },
  ivaAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  validity: {
    type: DataTypes.STRING,
    defaultValue: '30 DÍAS'
  },
  paymentTerms: {
    type: DataTypes.TEXT,
    defaultValue: '50% anticipo, 50% contra entrega.'
  },
  executionTime: {
    type: DataTypes.STRING,
    defaultValue: '60 días'
  },
  notes: {
    type: DataTypes.TEXT
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: 'quotations',
  timestamps: true
});

export default Quotation;
