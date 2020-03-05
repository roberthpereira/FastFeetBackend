import Deliveryman from '../models/Deliveryman';
import DeliverymanNotification from '../schemas/DeliverymanNotification';

class NotificationController {
  async index(req, res) {
    const deliveryman = Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      res.status(401).json({ message: 'Deliveryman does not exists' });
    }

    const notifications = await DeliverymanNotification.find({
      deliveryman: req.params.id,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // const notification = await DeliverymanNotification.findById(req.params.id);
    const notification = await DeliverymanNotification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
