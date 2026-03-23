const express = require('express');
const router = express.Router()
const {applyToJob, getMyApplication, getApplicantJob, updateApplicationStatus} = require('../controller/applicationController')

router.post(`/apply:id`, applyToJob);
router.get(`/all-applications`, getMyApplication)
router.get(`/job/:id`, getApplicantJob)
router.patch(`/update-status/:id`, updateApplicationStatus)

module.exports = router; 