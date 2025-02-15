const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Você precisa estar logado para acessar esta página!" });
    }

    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "Usuário não encontrado!" });
        }

        next();
    } catch (error) {
        console.error("Erro na verificação do token:", error);
        return res.status(401).json({ message: "Token inválido!" });
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Acesso negado! Apenas administradores podem acessar." });
    }
    next();
};

module.exports = { protect, adminMiddleware };
