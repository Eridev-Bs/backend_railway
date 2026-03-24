import { Client, Quotation } from '../models/index.js';
import { Op } from 'sequelize';

export const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({
      message: 'Cliente creado exitosamente',
      client
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { contactPerson: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Client.findAndCountAll({
      where,
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      clients: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id, {
      include: [{
        model: Quotation,
        as: 'quotations',
        order: [['createdAt', 'DESC']],
        limit: 10
      }]
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json({ client });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    await client.update(req.body);

    res.json({
      message: 'Cliente actualizado',
      client
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Soft delete
    await client.update({ isActive: false });

    res.json({ message: 'Cliente desactivado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getClientQuotations = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await Quotation.findAndCountAll({
      where: { clientId: id },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      quotations: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
