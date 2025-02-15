const User = require("../models/user");
const jwt = require("jsonwebtoken");

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const register = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "E-mail já cadastrado" });
        }

        const newUser = new User({
            name,
            email,
            password,
            isAdmin: isAdmin === "on" || isAdmin === true,
        });

        await newUser.save();
        res.redirect("/login");
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar o usuário", error: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Credenciais inválidas!" });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 3600000 });

        res.json({
            message: "Login realizado com sucesso!",
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao fazer login", error: error.message });
    }
};

module.exports = { register, login };
