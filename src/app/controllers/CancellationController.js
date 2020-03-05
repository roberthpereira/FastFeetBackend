import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Delivery_problem from '../models/Delivery_problem';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class CancellationController {
  async delete(req, res) {
    const { id: delivery_id } = req.params;

    const deliveryProblem = await Delivery_problem.findOne({
      where: { delivery_id },
      include: {
        model: Order,
        as: 'delivery',
        where: { canceled_at: null },
        include: [
          {
            model: Deliveryman,
            attributes: ['name', 'email'],
          },
          {
            model: Recipient,
          },
        ],
      },
    });

    if (!deliveryProblem) {
      return res.status(400).json('Delivery not found');
    }

    const { delivery } = deliveryProblem;

    delivery.canceled_at = new Date();

    await delivery.save();

    const recipient = delivery.Recipient;
    const deliveryman = delivery.Deliveryman;

    await Queue.add(CancellationMail.key, {
      recipient,
      deliveryman,
      delivery,
    });

    return res.json(deliveryProblem);
  }
}

export default new CancellationController();
