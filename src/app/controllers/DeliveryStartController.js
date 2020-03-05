import * as Yup from 'yup';
import { Op } from 'sequelize';
import {
  isBefore,
  isAfter,
  setSeconds,
  setMinutes,
  setHours,
  // parseISO,
} from 'date-fns';

import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryStartController {
  async update(req, res) {
    /**
     * Validation
     */
    const schema = Yup.object().shape({
      order_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /**
     * Check if deliveryman exists
     */
    const isDeliveryman = await Deliveryman.findByPk(req.params.id);

    if (!isDeliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not exist' });
    }

    /**
     * Check if delivery exists
     */
    const order = await Order.findOne({
      where: {
        id: req.body.order_id,
        deliveryman_id: req.params.id,
        canceled_at: null,
        start_date: null,
        end_date: null,
      },
    });

    if (!order) {
      return res.status(400).json('Delivery not found');
    }

    /**
     * Checks whether the current time is between 8:00 am and 6:00 pm
     */
    const startHour = setSeconds(setMinutes(setHours(new Date(), 8), 0), 0);
    const endHour = setSeconds(setMinutes(setHours(new Date(), 18), 0), 0);

    if (!(isAfter(new Date(), startHour) && isBefore(new Date(), endHour))) {
      return res
        .status(401)
        .json({ error: 'You can only deliver between 8:00am and 6:00pm' });
    }

    /**
     * Check if 5 deliveries have already been made today
     */
    const deliverysCount = await Order.findAll({
      where: {
        start_date: { [Op.between]: [startHour, endHour] },
      },
    });

    if (deliverysCount.length === 5) {
      return res.status(401).json('Only 5 deliveries per day are allowed');
    }

    /**
     * Update
     */
    const {
      id,
      recipient_id,
      deliveryman_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await order.update({ id: req.body.order_id, start_date: new Date() });

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
}

export default new DeliveryStartController();
