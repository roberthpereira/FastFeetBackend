import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
  /**
   * CREATE
   */
  async store(req, res) {
    // regra validation
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const recipient = await Recipient.create(req.body);

    return res.json(recipient);
  }

  /**
   * READ
   */
  async index(req, res) {
    const recipient = await Recipient.findAll();

    if (!recipient.length) {
      return res.status(400).json({ error: 'No recipient found' });
    }

    return res.json(recipient);
  }

  /**
   * UPDATE
   */
  async update(req, res) {
    // validation --------------------
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // --------------------

    const recipient = await Recipient.findByPk(req.params.id, {
      attributes: [
        'id',
        'name',
        'street',
        'number',
        'complement',
        'state',
        'city',
        'zipcode',
      ],
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    await recipient.update(req.body);

    return res.json(recipient);
  }

  /**
   * DELETE
   */
  async delete(req, res) {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      return res.status(400).json({ message: 'Recipient does not exists' });
    }

    await recipient.destroy();

    return res.json('Successfully deleted recipient!');
  }
}

export default new RecipientController();
