
import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['service', 'faq', 'testimonial', 'doctor'] 
  },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Content', contentSchema);
