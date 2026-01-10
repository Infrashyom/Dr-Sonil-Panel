
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const configSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  
  // Basic Info
  name: { type: String, default: "Dr. Sonil Women's Care Centre" },
  doctorName: { type: String, default: "Dr. Sonil Srivastava" },
  designation: { type: String, default: "Best Gynecologist & IVF Specialist" },
  
  // Images
  logo: { type: String, default: '' }, // Dynamic Logo
  doctorImage: { type: String, default: '' },
  reasonsImage: { type: String, default: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df4?q=80&w=1000' },
  aboutVideo: { type: String, default: 'https://www.youtube.com/watch?v=pL78_6q7eLg' },
  
  // Contact
  phone: { type: String, default: '+91 98765 43210' },
  email: { type: String, default: 'hello@drsonil.com' },
  address: { type: String, default: 'E-7/123, Arera Colony, Bhopal' },
  whatsapp: { type: String, default: '919876543210' },
  timings: { type: String, default: 'Mon - Sat: 10:00 AM - 08:00 PM' },
  
  // Links
  googleMapLink: { type: String, default: 'https://goo.gl/maps/placeholder' },
  googlePlaceId: { type: String, default: '' },
  
  // Socials
  socials: {
    instagram: { type: String, default: 'https://instagram.com' },
    facebook: { type: String, default: 'https://facebook.com' },
    youtube: { type: String, default: 'https://youtube.com' }
  },

  announcement: { type: String, default: '' },
  adminPassword: { type: String, required: true }
});

configSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.adminPassword);
};

export default mongoose.model('Config', configSchema);
