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

router.delete(
  "/delete-job/:id",
  isAuthenticated,
  authorizeRoles("employer"),
  deleteJob
);

router.patch(
  "/update-job/:id",
  isAuthenticated,
  authorizeRoles("employer"),
  updateJob
);

router.get("/all-jobs", getAllJobs);

router.get(
  "/my-jobs",
  isAuthenticated,
  authorizeRoles("employer"),
  jobCreatedByEmployer,
);

router.get(
  "/my-job/:id",
  isAuthenticated,
  authorizeRoles("employer"),
  getSingleEmployerJob
);

router.get(
  "/stats",
  isAuthenticated,
  authorizeRoles("employer"),
  employerStats
);

module.exports = router;
