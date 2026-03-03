import mongoose, { Schema, Document } from "mongoose";

export interface ICompanySearch extends Document {
  normalizedQuery: string;
  searchResults: any[];
  items: any[];
  createdAt: Date;
}

const CompanySearchSchema = new Schema<ICompanySearch>({
  normalizedQuery: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  searchResults: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  items: {
    type: [Schema.Types.ObjectId],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// TTL index - documents will be automatically deleted after 7 days (604800 seconds)
CompanySearchSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

export const CompanySearch = mongoose.model<ICompanySearch>(
  "CompanySearch",
  CompanySearchSchema,
);
