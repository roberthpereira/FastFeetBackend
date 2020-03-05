import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';

class DeliveryController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(401).json({ error: 'User does not exist' });
    }

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null,
      },
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'product',
        'canceled_at',
        'start_date',
      ],
    });

    if (!orders.length) {
      return res
        .status(400)
        .json({ error: 'There is no delivery to do at the moment' });
    }

    return res.json(orders);
  }
}

export default new DeliveryController();
