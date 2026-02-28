import { Patient } from "../model/patientSchema.js";

/* ---------------- ADD PATIENT ---------------- */
export const addPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, address, medicalNotes } = req.body;

    if (!name || !age || !gender || !contact) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      address,
      medicalNotes,
      createdBy: req.user._id, // from AuthMiddleware
    });

    res.status(201).json({
      success: true,
      message: "Patient added successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add patient",
      error: error.message,
    });
  }
};

/* ---------------- GET ALL PATIENTS ---------------- */
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
      error: error.message,
    });
  }
};

/* ---------------- GET SINGLE PATIENT ---------------- */
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate(
      "createdBy",
      "name role"
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch patient",
      error: error.message,
    });
  }
};

/* ---------------- UPDATE PATIENT ---------------- */
export const updatePatient = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update patient",
      error: error.message,
    });
  }
};


