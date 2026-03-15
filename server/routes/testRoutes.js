const express = require("express");
const router = express.Router();
const testController = require("../controllers/testController");

router.get("/", testController.testAPI);

router.get("/db", testController.testDatabase);

router.get("/health", testController.healthCheck);

module.exports = router;
