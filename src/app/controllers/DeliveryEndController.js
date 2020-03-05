import * as Yup from 'yup';
import { Op } from 'sequelize';

import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryEndController {
  async update(req, res) {
    /**
     * Validation
     */
    const schema = Yup.object().shape({
      order_id: Yup.number().required(),
      signature_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id: deliveryman_id } = req.params;
    const { order_id, signature_id } = req.body;

    /**
     * Check if deliveryman exists
     */
    const isDeliveryman = await Deliveryman.findByPk(deliveryman_id);

    if (!isDeliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    /**
     * Check if delivery exists
     */
    const order = await Order.findOne({
      where: {
        id: order_id,
        deliveryman_id,
        canceled_at: null,
        start_date: { [Op.ne]: null },
        end_date: null,
      },
    });

    if (!order) {
      return res.status(400).json('Delivery not found');
    }

    /**
     * Update
     */
    const {
      id,
      recipient_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await order.update({
      id: order_id,
      signature_id,
      end_date: new Date(),
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }
}

export default new DeliveryEndController();
