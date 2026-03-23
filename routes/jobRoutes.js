const express = require("express");
const router = express.Router();
const {
  createJob,
  deleteJob,
  updateJob,
  jobCreatedByEmployer,
  getSingleEmployerJob,
  employerStats,
  getAllJobs,
} = require("../controller/jobController");

const {
  isAuthenticated,
  authorizeRoles,
} = require("../middleware/authMiddleware");

router.post(
  "/create-job",
  isAuthenticated,
  authorizeRoles("employer"),
  createJob,
);
router.delete("/delete-job/:id", deleteJob);
router.patch("/update-job/:id", updateJob);
router.get("/all-jobs", getAllJobs);

module.exports = router;
