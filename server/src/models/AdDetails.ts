import mongoose, { Schema, Document } from "mongoose";

export interface IAdDetails extends Document {
  ad_archive_id: string;
  eu_total_reach?: number;
  age_country_gender_reach_breakdown?: any[];
  location_audience?: any[];
  gender_audience?: string;
  age_audience?: { min?: number; max?: number };
  targets_eu: boolean;
  payer?: string;
  createdAt: Date;
}

const AdDetailsSchema = new Schema<IAdDetails>({
  ad_archive_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  eu_total_reach: {
    type: Number,
  },
  age_country_gender_reach_breakdown: {
    type: [Schema.Types.Mixed],
  },
  location_audience: {
    type: [Schema.Types.Mixed],
  },
  gender_audience: {
    type: String,
  },
  age_audience: {
    type: Schema.Types.Mixed,
  },
  targets_eu: {
    type: Boolean,
    required: true,
    default: false,
  },
  payer: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const AdDetails = mongoose.model<IAdDetails>(
  "AdDetails",
  AdDetailsSchema,
);

