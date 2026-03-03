import mongoose, { Schema, Document } from "mongoose";

export interface IAdSearch extends Document {
  cacheKey: string;
  ads: any[];
  search_information?: any;
  pagination?: any;
  ad_library_page_info?: any;
  createdAt: Date;
}

const AdSearchSchema = new Schema<IAdSearch>({
  cacheKey: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  ads: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  search_information: {
    type: Schema.Types.Mixed,
  },
  pagination: {
    type: Schema.Types.Mixed,
  },
  ad_library_page_info: {
    type: Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL index - documents will be automatically deleted after 7 days (604800 seconds)
AdSearchSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

export const AdSearch = mongoose.model<IAdSearch>("AdSearch", AdSearchSchema);
