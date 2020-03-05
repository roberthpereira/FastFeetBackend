import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { recipient, deliveryman, delivery } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Entrega cancelada',
      template: 'cancellation',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        adress: `${recipient.street}, ${recipient.number}, ${recipient.complement}. ${recipient.city}/${recipient.state} - ${recipient.zipcode}`,
        product: delivery.product,
        canceledAt: format(
          parseISO(delivery.canceled_at),
          "dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
