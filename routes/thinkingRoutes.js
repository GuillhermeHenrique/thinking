const express = require("express");
const router = express.Router();
const ThinkingController = require("../controllers/ThinkingController");

// helpers
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/add", checkAuth, ThinkingController.createThinking);
router.post("/add", checkAuth, ThinkingController.createThinkingSave);
router.get("/dashboard", checkAuth, ThinkingController.dashboard);
router.post("/remove", checkAuth, ThinkingController.removeThinking);
router.get("/edit/:id", checkAuth, ThinkingController.updateThinking);
router.post("/edit", checkAuth, ThinkingController.updateThinkingSave);
router.get("/", ThinkingController.showThinking);

module.exports = router;
