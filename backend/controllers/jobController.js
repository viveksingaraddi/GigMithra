import Job from "../models/Job.js";

export const createJob = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      authoriserId: req.user._id,
      authoriserName: req.user.name,
      companyName: req.user.companyName || req.user.name
    };

    const job = await Job.create(payload);
    return res.status(201).json(job);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create job" });
  }
};

export const getAllJobs = async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ authoriserId: req.user._id }).sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch jobs" });
  }
};
