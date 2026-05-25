import { Schema } from 'mongoose';
import { Station } from 'src/bussiness/entities/station.entity';
import { Measurement } from '../object/measurement-object.schema';

export const UserSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    stations: [{ type: Schema.Types.ObjectId, ref: Station.name }],
    subscriptions: [{ type: Schema.Types.ObjectId, ref: Station.name }],
    alerts: [{ type: Schema.Types.ObjectId, ref: Measurement.name }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
