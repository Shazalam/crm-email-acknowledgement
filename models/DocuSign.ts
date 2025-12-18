// // models/Customer.ts
// import mongoose, { Schema, Document, Types } from 'mongoose';

// export interface ICustomer extends Document {
//   _id: Types.ObjectId;   // 👈 add this
//   ip?: string;
//   sessionId?: string;
//   device?: string;
//   browser?: string;
//   os?: string;
//   bookingId?: Types.ObjectId;  // 🔑 reference to Booking (in CRM DB)
//   location?: {
//     country?: string;
//     region?: string;
//     city?: string;
//     zipcode?: string;
//     accuracy?: string;
//     fullAddress?: string;
//     coordinates?: { lat: number; lon: number };
//   };
//   acknowledged?: boolean; // ✅ new field
//   frontImage?: string; // Cloudinary URL
//   backImage?: string; // Cloudinary URL
//   createdAt: Date;
//   updatedAt: Date;
// }

// const DocusignSchema = new Schema<ICustomer>({
//   ip: String,
//   sessionId: { type: String, index: true },
//   device: String,
//   browser: String,
//   os: String,
//   bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: false }, // 🔗 store booking reference
//   location: {
//     country: String,
//     region: String,
//     city: String,
//     zipcode: String,
//     accuracy:String,
//     fullAddress: String,
//     coordinates: { lat: Number, lon: Number }
//   },
//   acknowledged: { type: Boolean, default: false }, // ✅ new field
//   frontImage: String,
//   backImage: String
// }, { timestamps: true });

// export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', DocusignSchema);
















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
  locationPermission?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DocusignSchema = new Schema<IDocusign>({
  ip: String,
  sessionId: { type: String, index: true },
  device: String,
  browser: String,
  os: String,
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: false },
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
  acknowledged: { type: Boolean, default: false },
  frontImage: String,
  backImage: String,
  // Additional metadata - MAKE SURE THESE ARE INCLUDED
  userAgent: String,
  screenResolution: String,
  timezone: String,
  language: String,
  locationPermission: String
}, { 
  timestamps: true 
});

// Add index for geospatial queries if needed
DocusignSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.models.Customer || mongoose.model<IDocusign>('Customer', DocusignSchema);