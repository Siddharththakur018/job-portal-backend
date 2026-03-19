const Application = require("../model/applicationModel");
const multer = require("../middleware/multerMiddleware");

const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json("You already applied for this job!");
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: req.file.path,
      coverLetter: req.body.coverLetter,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyApplication = async (req, res) => {
  try {
    const application = await Application.find({
      applicant: req.user._id,
    }).populate("job");

    res.status(201).json({
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getApplicantJob = async (req, res) => {
  try {
    const application = await Application.find({
      job: req.params.jobId,
    }).populate("applicant", "name email");

    res.status(201).json({ application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
