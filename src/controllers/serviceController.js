import { Service, Category } from '../models/index.js';
import { Op } from 'sequelize';

export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      message: 'Servicio creado exitosamente',
      service
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const { page = 1, limit = 50, search, categoryId, isActive } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (isActive !== undefined) where.isActive = isActive === 'true';
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Service.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order: [['name', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      services: rows,
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

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id, {
      include: [{ model: Category, as: 'category' }]
    });

    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    res.json({ service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    await service.update(req.body);

    res.json({
      message: 'Servicio actualizado',
      service
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }

    await service.update({ isActive: false });

    res.json({ message: 'Servicio desactivado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
