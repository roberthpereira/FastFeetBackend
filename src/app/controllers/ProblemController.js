import * as Yup from 'yup';
import Order from '../models/Order';
import Delivery_problem from '../models/Delivery_problem';

class ProblemController {
  // CREATE
  async store(req, res) {
    /**
     * Validation
     */
    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id: delivery_id } = req.params;
    const { deliveryman_id, description } = req.body;

    const order = await Order.findOne({
      where: {
        id: delivery_id,
        deliveryman_id,
        end_date: null,
      },
    });

    if (!order) {
      return res.status(400).json('Delivery not found');
    }

    await Delivery_problem.create({
      delivery_id,
      description,
    });

    return res.json({ delivery_id, description });
  }

  // READ
  async index(req, res) {
    const deliveryProblems = await Delivery_problem.findAll({
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

    if (!deliveryProblems.length) {
      return res.status(400).json({ message: 'No problem delivery found' });
    }

    return res.json(deliveryProblems);
  }
}

export default new ProblemController();
