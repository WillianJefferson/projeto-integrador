const express = require("express");
const projetoController = require("../controllers/projetoController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", projetoController.listPublic);
router.get("/me", authMiddleware, projetoController.listMine);
router.get("/:id", authMiddleware.optional, projetoController.findById);
router.post("/", authMiddleware, projetoController.create);
router.put("/:id", authMiddleware, projetoController.update);
router.delete("/:id", authMiddleware, projetoController.remove);

module.exports = router;
