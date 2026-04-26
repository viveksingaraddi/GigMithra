import express from "express";
import { createJob, getAllJobs, getMyJobs } from "../controllers/jobController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", protect, requireRole("authoriser"), createJob);
router.get("/mine", protect, requireRole("authoriser"), getMyJobs);

export default router;
