import { Schema } from 'mongoose';
import { Measurement } from 'src/bussiness/entities/measurement.entity';

export const StationSchema = new Schema(
  {
    name: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point', required: true },
      coordinates: { type: [Number], required: true },
    },
    sensorModel: String,
    state: { type: String, enum: ['active', 'inactive'], default: 'active' },
    provider: { type: String, default: null, required: false },
    owner: { type: String },
    subscribers: [{ type: String }],
    measurements: [{ type: Schema.Types.ObjectId, ref: Measurement.name }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

StationSchema.index({ location: '2dsphere' });
