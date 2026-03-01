const Job = require("../model/jobModel");

exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, jobType } = req.body;

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salary,
      jobType,
      postedBy: req.user._id,
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job  = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(job, req.body);

    await job.save();

    res.json({ message: "Job updated", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.jobCreatedByEmployer = async(req, res) => {
    try {
        const job = await Job.find({postedBy: req.user._id}).sort({ createdAt: -1 });

        res.json(job);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: error.message});
    }
}