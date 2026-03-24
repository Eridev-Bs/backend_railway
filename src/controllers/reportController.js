import { Quotation, Client, User, QuotationItem } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export const getDashboard = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Total de cotizaciones
    const totalQuotations = await Quotation.count({ where: dateFilter });

    // Cotizaciones por estado
    const quotationsByStatus = await Quotation.findAll({
      where: dateFilter,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount']
      ],
      group: ['status'],
      raw: true
    });

    // Total en ventas (cotizaciones aceptadas)
    const totalSales = await Quotation.sum('total', {
      where: {
        ...dateFilter,
        status: 'accepted'
      }
    });

    // Tasa de conversión
    const acceptedCount = await Quotation.count({
      where: { ...dateFilter, status: 'accepted' }
    });
    const conversionRate = totalQuotations > 0 
      ? ((acceptedCount / totalQuotations) * 100).toFixed(2)
      : 0;

    // Top clientes
    const topClients = await Client.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('quotations.id')), 'quotationCount'],
        [sequelize.fn('SUM', sequelize.col('quotations.total')), 'totalAmount']
      ],
      include: [{
        model: Quotation,
        as: 'quotations',
        attributes: [],
        where: dateFilter
      }],
      group: ['Client.id'],
      order: [[sequelize.literal('totalAmount'), 'DESC']],
      limit: 10,
      raw: true
    });

    // Cotizaciones por vendedor
    const quotationsByUser = await User.findAll({
      attributes: [
        'id',
        'name',
        [sequelize.fn('COUNT', sequelize.col('quotations.id')), 'quotationCount'],
        [sequelize.fn('SUM', sequelize.col('quotations.total')), 'totalAmount']
      ],
      include: [{
        model: Quotation,
        as: 'quotations',
        attributes: [],
        where: dateFilter
      }],
      group: ['User.id'],
      order: [[sequelize.literal('quotationCount'), 'DESC']],
      raw: true
    });

    res.json({
      summary: {
        totalQuotations,
        totalSales: totalSales || 0,
        conversionRate: parseFloat(conversionRate),
        quotationsByStatus
      },
      topClients,
      quotationsByUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuotationsByPeriod = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Se requieren startDate y endDate' });
    }

    let dateFormat;
    switch (groupBy) {
      case 'month':
        dateFormat = '%Y-%m';
        break;
      case 'week':
        dateFormat = '%Y-%W';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const quotations = await Quotation.findAll({
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('createdAt'), dateFormat), 'period'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total')), 'totalAmount']
      ],
      where: {
        createdAt: {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        }
      },
      group: ['period'],
      order: [[sequelize.literal('period'), 'ASC']],
      raw: true
    });

    res.json({ quotations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTopServices = async (req, res) => {
  try {
    const { startDate, endDate, limit = 10 } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter['$quotation.createdAt$'] = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const topServices = await QuotationItem.findAll({
      attributes: [
        'description',
        [sequelize.fn('COUNT', sequelize.col('QuotationItem.id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalAmount']
      ],
      include: [{
        model: Quotation,
        as: 'quotation',
        attributes: []
      }],
      where: dateFilter,
      group: ['description'],
      order: [[sequelize.literal('count'), 'DESC']],
      limit: parseInt(limit),
      raw: true
    });

    res.json({ topServices });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
