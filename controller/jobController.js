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
      postedBy: req.user.id,
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

    if (job.postedBy.toString() !== req.user.id.toString()) {
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
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id.toString()) {
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

exports.jobCreatedByEmployer = async (req, res) => {
  try {
    const job = await Job.find({ postedBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleEmployerJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found!" });
    }

    if (job.postedBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.employerStats = async (req, res) => {
  try {
    const job = await Job.find({ postedBy: req.user.id });

    const totalJobs = job.length;

    const totalViews = job.reduce((sum, job) => {
      return sum + job.views;
    }, 0);

    const totalApplications = job.reduce((sum, job) => {
      return sum + job.applicationsCount;
    }, 0);

    const openJobs = job.filter((job) => job.status === "open").length;

    res.json({
      totalJobs,
      totalViews,
      totalApplications,
      openJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      status,
      jobType,
      minSalary,
      maxSalary,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (location) {
      query.location = location;
    }

    if (status) {
      query.status = status;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = Number(minSalary);
      if (maxSalary) query.salary.$lte = Number(maxSalary);
    }

    let sortOption = { createdAt: -1 };

    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    const skip = (page - 1) * limit;

    const job = await Job.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      currentPage: Number(page),
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
