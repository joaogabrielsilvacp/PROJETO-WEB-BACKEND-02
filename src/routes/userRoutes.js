const express = require("express");
const { register, login } = require("../controllers/userController");
const { protect, adminMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/admin/painel", protect, adminMiddleware, (req, res) => {
    res.json({ message: "Bem-vindo ao painel de administração!" });
});

module.exports = router;

