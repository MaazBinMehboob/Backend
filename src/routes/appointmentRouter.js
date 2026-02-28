import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

import {
  bookAppointment,
  updateStatus,
  getDoctorAppointments,
  getPatientAppointments,
} from "../controllers/appointmentController.js";

const router = express.Router();

/* -------- Book Appointment -------- */
router.post(
  "/book",
  AuthMiddleware,
  authorizeRoles("receptionist", "patient"),
  bookAppointment
);

/* -------- Update Appointment Status -------- */
router.put(
  "/:id/status",
  AuthMiddleware,
  authorizeRoles("doctor", "receptionist"),
  updateStatus
);

/* -------- Get Doctor Appointments -------- */
router.get(
  "/doctor/:doctorId",
  AuthMiddleware,
  authorizeRoles("doctor"),
  getDoctorAppointments
);

/* -------- Get Patient Appointments -------- */
router.get(
  "/patient/:patientId",
  AuthMiddleware,
  authorizeRoles("patient", "receptionist", "admin"),
  getPatientAppointments
);

export { router as appointmentRouter };