import { Schema } from 'mongoose';
import { Station } from 'src/bussiness/entities/station.entity';

export const MeasurementSchema = new Schema(
  {
    datetime: Date,
    alert: Boolean,
    alertType: {
      type: String,
      enum: ['Ninguna', 'Calor extremo', 'Helada', 'Tormenta', 'Humedad crítica'],
      default: 'Ninguna',
    },
    pressure: Number,
    temperature: Number,
    humidity: Number,
    station: { type: Schema.Types.ObjectId, ref: Station.name },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, selectPopulatedPaths: true },
);
