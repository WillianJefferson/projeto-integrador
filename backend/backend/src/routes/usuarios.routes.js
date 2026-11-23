const express = require("express");
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/me", usuarioController.getMe);
router.put("/me", usuarioController.updateMe);
router.delete("/me", usuarioController.deleteMe);

module.exports = router;
