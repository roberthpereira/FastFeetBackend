import mongoose from 'mongoose';

const DeliverymanNotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    deliveryman: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  'DeliverymanNotification',
  DeliverymanNotificationSchema
);
