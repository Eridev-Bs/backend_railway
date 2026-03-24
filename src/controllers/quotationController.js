import { Quotation, QuotationItem, Client, User } from '../models/index.js';
import { Op } from 'sequelize';
import { sendEmail } from '../config/email.js';

export const createQuotation = async (req, res) => {
  try {
    const {
      clientId,
      issueDate,
      expirationDate,
      currency,
      items,
      validity,
      paymentTerms,
      executionTime,
      ivaPercentage,
      notes
    } = req.body;

    // Generar número de cotización
    const lastQuotation = await Quotation.findOne({
      order: [['createdAt', 'DESC']]
    });

    let nextNumber = 1;
    if (lastQuotation && lastQuotation.quoteNumber) {
      const match = lastQuotation.quoteNumber.match(/COT-VBO-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    const quoteNumber = `COT-VBO-${nextNumber.toString().padStart(4, '0')}`;

    // Calcular totales
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    const ivaAmount = subtotal * (parseFloat(ivaPercentage) / 100);
    const total = subtotal + ivaAmount;

    const quotation = await Quotation.create({
      quoteNumber,
      userId: req.user.id,
      clientId,
      issueDate,
      expirationDate,
      currency,
      subtotal,
      ivaPercentage,
      ivaAmount,
      total,
      validity,
      paymentTerms,
      executionTime,
      notes,
      status: 'draft'
    });

    // Crear items
    const quotationItems = await Promise.all(
      items.map((item, index) =>
        QuotationItem.create({
          quotationId: quotation.id,
          code: item.code,
          description: item.description,
          quantity: item.quantity,
          quantityLabel: item.quantityLabel,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          order: index
        })
      )
    );

    const fullQuotation = await Quotation.findByPk(quotation.id, {
      include: [
        { model: QuotationItem, as: 'items' },
        { model: Client, as: 'client' },
        { model: User, as: 'user' }
      ]
    });

    res.status(201).json({
      message: 'Cotización creada exitosamente',
      quotation: fullQuotation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getQuotations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, clientId, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (search) {
      where[Op.or] = [
        { quoteNumber: { [Op.iLike]: `%${search}%` } },
        { notes: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Si no es admin, solo ver sus cotizaciones
    if (req.user.role !== 'admin') {
      where.userId = req.user.id;
    }

    const { count, rows } = await Quotation.findAndCountAll({
      where,
      include: [
        { model: Client, as: 'client' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
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

export const getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await Quotation.findByPk(id, {
      include: [
        { model: QuotationItem, as: 'items', order: [['order', 'ASC']] },
        { model: Client, as: 'client' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!quotation) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && quotation.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta cotización' });
    }

    res.json({ quotation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findByPk(id);

    if (!quotation) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    // Verificar permisos
    if (req.user.role !== 'admin' && quotation.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta cotización' });
    }

    const { items, ...quotationData } = req.body;

    // Recalcular totales si hay items
    if (items) {
      const subtotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
      const ivaAmount = subtotal * (parseFloat(quotationData.ivaPercentage || quotation.ivaPercentage) / 100);
      quotationData.subtotal = subtotal;
      quotationData.ivaAmount = ivaAmount;
      quotationData.total = subtotal + ivaAmount;

      // Eliminar items antiguos y crear nuevos
      await QuotationItem.destroy({ where: { quotationId: id } });
      await Promise.all(
        items.map((item, index) =>
          QuotationItem.create({
            quotationId: id,
            ...item,
            order: index
          })
        )
      );
    }

    await quotation.update(quotationData);

    const updatedQuotation = await Quotation.findByPk(id, {
      include: [
        { model: QuotationItem, as: 'items' },
        { model: Client, as: 'client' },
        { model: User, as: 'user' }
      ]
    });

    res.json({
      message: 'Cotización actualizada',
      quotation: updatedQuotation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findByPk(id);

    if (!quotation) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    // Solo admin puede eliminar
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar cotizaciones' });
    }

    await quotation.destroy();

    res.json({ message: 'Cotización eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendQuotationEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { recipientEmail, message } = req.body;

    const quotation = await Quotation.findByPk(id, {
      include: [
        { model: QuotationItem, as: 'items' },
        { model: Client, as: 'client' }
      ]
    });

    if (!quotation) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    const emailHtml = `
      <h2>Cotización ${quotation.quoteNumber}</h2>
      <p>${message || 'Adjuntamos la cotización solicitada.'}</p>
      <p><strong>Cliente:</strong> ${quotation.client.name}</p>
      <p><strong>Total:</strong> ${quotation.currency} ${quotation.total}</p>
      <p><strong>Válida hasta:</strong> ${quotation.expirationDate}</p>
    `;

    await sendEmail({
      to: recipientEmail || quotation.client.email,
      subject: `Cotización ${quotation.quoteNumber} - Virtual Back Office`,
      html: emailHtml
    });

    await quotation.update({ status: 'sent' });

    res.json({ message: 'Cotización enviada por email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
