import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import Mail from '../../lib/Mail';

class DeliveryMail {
  get key() {
    return 'DeliveryMail';
  }

  async handle({ data }) {
    const { recipient, deliveryman, product } = data;

    console.log('A fila executou');

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `Nova encomenda disponivel para retirada: ${product}`,
      template: 'delivery',
      context: {
        deliveryman: deliveryman.name,
        recipient: recipient.name,
        adress: `${recipient.street}, ${recipient.number}, ${recipient.complement}. ${recipient.city}/${recipient.state} - ${recipient.zipcode}`,
        product,
        date: format(new Date(), "dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });
  }
}

export default new DeliveryMail();
