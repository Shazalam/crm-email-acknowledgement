import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDocusign extends Document {
  _id: Types.ObjectId;
  ip?: string;
  sessionId?: string;
  device?: string;
  browser?: string;
  os?: string;
  bookingId?: Types.ObjectId;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    zipcode?: string;
    accuracy?: string;
    fullAddress?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  acknowledged?: boolean;
  frontImage?: string;
  backImage?: string;
  // Additional metadata fields - MAKE SURE THESE ARE IN SCHEMA
  userAgent?: string;
  screenResolution?: string;
  timezone?: string;
  language?: string;
  // locationPermission?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocusignSchema = new Schema<IDocusign>({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: false },
  acknowledged: { type: Boolean, default: false },
  frontImage: String,
  backImage: String,
  device: String,
  browser: String,
  os: String,
  ip: String,
  location: {
    country: String,
    region: String,
    city: String,
    zipcode: String,
    accuracy: String,
    fullAddress: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // Additional metadata - MAKE SURE THESE ARE INCLUDED
  userAgent: String,
  screenResolution: String,
  timezone: String,
  language: String,
  // locationPermission: String,
  sessionId: { type: String, index: true },
}, {
  timestamps: true
});

// Add index for geospatial queries if needed
DocusignSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.models.Customer || mongoose.model<IDocusign>('Customer', DocusignSchema);