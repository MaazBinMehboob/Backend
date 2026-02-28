import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";

import {
  addPatient,
  getPatients,
  getPatientById,
  updatePatient,
} from "../controllers/patientControllers.js";

const patientRouter = express.Router();

/* -------- Add Patient -------- */
patientRouter.post(
  "/add",
  AuthMiddleware,
  authorizeRoles("receptionist", "admin"),
  addPatient
);

/* -------- Get All Patients -------- */
patientRouter.get(
  "/all",
  AuthMiddleware,
  authorizeRoles("receptionist", "admin", "doctor"),
  getPatients
);

/* -------- Get Single Patient -------- */
patientRouter.get(
  "/:id",
  AuthMiddleware,
  authorizeRoles("receptionist", "admin", "doctor"),
  getPatientById
);

/* -------- Update Patient -------- */
patientRouter.put(
  "/:id",
  AuthMiddleware,
  authorizeRoles("receptionist", "admin"),
  updatePatient
);

export default patientRouter;