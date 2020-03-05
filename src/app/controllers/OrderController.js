import * as Yup from 'yup';

import Order from '../models/Order';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import DeliverymanNotification from '../schemas/DeliverymanNotification';

import DeliveryMail from '../jobs/DeliveryMail';
import Queue from '../../lib/Queue';

class OrderControlelr {
  /**
   * CREATE
   */
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await Order.create(req.body);

    const recipient = await Recipient.findByPk(recipient_id);
    const deliveryman = await Deliveryman.findByPk(deliveryman_id);

    /**
     * Email Order Notification
     */
    await Queue.add(DeliveryMail.key, {
      recipient,
      deliveryman,
      product,
    });

    /**
     * Notifiy order Deliveryman
     */
    await DeliverymanNotification.create({
      content: `Nova encomenda disponivel para retirada: ${product}.
                Destinatario: ${recipient.name}.
                Endereço: ${recipient.street}, ${recipient.number}, ${recipient.city}/${recipient.state} - ${recipient.zipcode}`,
      deliveryman: deliveryman_id,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  /**
   * READ
   */
  async index(req, res) {
    const orders = await Order.findAll({
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
    });

    if (!orders.length) {
      return res.status(400).json({ error: 'No orders found' });
    }

    return res.json(orders);
  }

  /**
   * UPDATE
   */
  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ message: 'Order not found' });
    }

    await order.update(req.body);

    return res.json(order);
  }

  /**
   * DELETE
   */
  async delete(req, res) {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(400).json({ message: 'Order not found' });
    }

    order.destroy();

    return res.json('Order successfully deleted');
  }
}

export default new OrderControlelr();
