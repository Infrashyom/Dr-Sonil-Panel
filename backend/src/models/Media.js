
import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String }, // Cloudinary ID for deletion
  title: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['clinic', 'events', 'patients', 'surgery', 'videos'],
    default: 'clinic'
  },
  type: {
    type: String,
    enum: ['image', 'video', 'reel'],
    default: 'image'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const heroSchema = new mongoose.Schema({
  image: { type: String, required: true },
  public_id: { type: String }, // Cloudinary ID for deletion
  title: { type: String, required: true },
  subtitle: { type: String, required: true }
}, { timestamps: true });

export const Gallery = mongoose.model('Gallery', gallerySchema);
export const Hero = mongoose.model('Hero', heroSchema);
