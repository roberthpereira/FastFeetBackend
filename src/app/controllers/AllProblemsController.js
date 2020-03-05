import Problems from '../models/Delivery_problem';
import Order from '../models/Order';

class AllProblemsController {
  async index(req, res) {
    const allProblems = await Problems.findAll({
      attributes: ['id', 'description', 'delivery_id'],
      include: {
        model: Order,
        as: 'delivery',
        attributes: [
          'product',
          'canceled_at',
          'start_date',
          'recipient_id',
          'deliveryman_id',
        ],
      },
    });

    if (!allProblems.length) {
      return res.status(400).json({ message: 'No problem delivery found' });
    }

    return res.json(allProblems);
  }
}

export default new AllProblemsController();
