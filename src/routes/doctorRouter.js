import express from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import {
  getAllDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
} from "../controllers/doctorController.js";

const doctorRouter = express.Router();

/* -------- GET ALL DOCTORS -------- */
doctorRouter.get(
  "/all",
  AuthMiddleware,
  authorizeRoles("admin", "receptionist", "patient", "doctor"),
  getAllDoctors
);

/* -------- GET SINGLE DOCTOR -------- */
doctorRouter.get(
  "/:id",
  AuthMiddleware,
  authorizeRoles("admin", "receptionist", "patient", "doctor"),
  getDoctorById
);

/* -------- ADD DOCTOR -------- */
doctorRouter.post(
  "/add",
  AuthMiddleware,
  authorizeRoles("admin"),
  addDoctor
);

/* -------- UPDATE DOCTOR -------- */
doctorRouter.put(
  "/:id",
  AuthMiddleware,
  authorizeRoles("admin"),
  updateDoctor
);

export { doctorRouter };
