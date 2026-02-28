import { Appointment } from "../model/appointmentSchema.js";
import { Patient } from "../model/patientSchema.js";

/* ---------------- BOOK APPOINTMENT ---------------- */
export const bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, notes } = req.body;

    if (!patientId || !doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "patientId, doctorId and date are required",
      });
    }

    // Optional: Check if patient exists
    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
      error: error.message,
    });
  }
};

/* ---------------- UPDATE APPOINTMENT STATUS ---------------- */
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment status updated",
      appointment: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

/* ---------------- GET DOCTOR APPOINTMENTS ---------------- */
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate("patientId", "name age gender contact")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

/* ---------------- GET PATIENT APPOINTMENTS ---------------- */
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId })
      .populate("doctorId", "name email role")
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient appointments",
      error: error.message,
    });
  }
};