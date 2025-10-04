// models/Customer.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICustomer extends Document {
  _id: Types.ObjectId;   // 👈 add this
  ip?: string;
  sessionId?: string;
  device?: string;
  browser?: string;
  os?: string;
  bookingId?: Types.ObjectId;  // 🔑 reference to Booking (in CRM DB)
  location?: {
    country?: string;
    region?: string;
    city?: string;
    zipcode?: string;
  };
  acknowledged?: boolean; // ✅ new field
  frontImage?: string; // Cloudinary URL
  backImage?: string; // Cloudinary URL
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  ip: String,
  sessionId: { type: String, index: true },
  device: String,
  browser: String,
  os: String,
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: false }, // 🔗 store booking reference
  location: {
    country: String,
    region: String,
    city: String,
    zipcode: String
  },
  acknowledged: { type: Boolean, default: false }, // ✅ new field
  frontImage: String,
  backImage: String
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
