
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  department: { type: String, required: true },
  date: { type: String, required: true }, 
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
