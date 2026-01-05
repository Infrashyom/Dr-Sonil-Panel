import Appointment from '../models/Appointment.js';

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private (Admin)
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public
export const createAppointment = async (req, res) => {
  try {
    const { patientName, phone, department, date, reason } = req.body;
    
    const appointment = await Appointment.create({
      patientName,
      phone,
      department,
      date,
      reason
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private (Admin)
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
      appointment.status = status;
      const updated = await appointment.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};