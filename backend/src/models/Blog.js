import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  public_id: { type: String }, // For Cloudinary deletion
  author: { type: String, default: 'Dr. Sonil' }
}, {
  timestamps: true
});

export default mongoose.model('Blog', blogSchema);
