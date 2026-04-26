import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await Application.findOne({ jobId, workerId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const application = await Application.create({
      jobId,
      workerId: req.user._id,
      workerName: req.user.name,
      workerPhone: req.user.phone,
      workerLocation: req.user.location,
      status: "pending"
    });

    return res.status(201).json(application);
  } catch (error) {
    return res.status(500).json({ message: "Failed to apply to job" });
  }
};

export const getWorkerApplications = async (req, res) => {
  try {
    const applications = await Application.find({ workerId: req.user._id }).sort({ createdAt: -1 });
    return res.json(applications);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (String(job.authoriserId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const applications = await Application.find({ jobId }).sort({ createdAt: -1 });
    return res.json(applications);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch applications" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.jobId);
    if (!job || String(job.authoriserId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    application.status = status;
    await application.save();

    return res.json(application);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update application status" });
  }
};
