import express from "express";
import {
  applyToJob,
  getWorkerApplications,
  getApplicationsForJob,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, requireRole("worker"), applyToJob);
router.get("/mine", protect, requireRole("worker"), getWorkerApplications);
router.get("/job/:jobId", protect, requireRole("authoriser"), getApplicationsForJob);
router.patch("/:id/status", protect, requireRole("authoriser"), updateApplicationStatus);

export default router;
