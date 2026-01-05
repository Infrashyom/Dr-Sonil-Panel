import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  date: { type: String }, // Storing as string to match frontend 'YYYY-MM-DD' or free text
  reason: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending' 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

export default mongoose.model('Appointment', appointmentSchema);