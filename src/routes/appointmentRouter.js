import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

import {
  bookAppointment,
  updateStatus,
  getDoctorAppointments,
  getPatientAppointments,
} from "../controllers/appointmentController.js";

const appointmentRouter = express.Router();

/* -------- Book Appointment -------- */
appointmentRouter.post(
  "/book",
  AuthMiddleware,
  authorizeRoles("receptionist", "patient"),
  bookAppointment
);

/* -------- Update Appointment Status -------- */
appointmentRouter.put(
  "/:id/status",
  AuthMiddleware,
  authorizeRoles("doctor", "receptionist"),
  updateStatus
);

/* -------- Get Doctor Appointments -------- */
appointmentRouter.get(
  "/doctor/:doctorId",
  AuthMiddleware,
  authorizeRoles("doctor"),
  getDoctorAppointments
);

/* -------- Get Patient Appointments -------- */
appointmentRouter.get(
  "/patient/:patientId",
  AuthMiddleware,
  authorizeRoles("patient", "receptionist", "admin"),
  getPatientAppointments
);

export { appointmentRouter };