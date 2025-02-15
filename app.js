require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const userRoutes = require("./src/routes/userRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");
const { protect } = require("./src/middlewares/authMiddleware");
const Ticket = require("./src/models/ticketModel");
const User = require("./src/models/user");
const jwt = require("jsonwebtoken");
const app = express();


app.use(cookieParser());


app.use(express.static(path.join(__dirname, "public")));


const hbs = exphbs.create({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views", "partials"),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, 
        allowProtoMethodsByDefault: true,
    }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(async (req, res, next) => {
    let token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            res.locals.user = req.user;
            res.locals.isAdmin = req.user ? req.user.isAdmin : false; 
        } catch (error) {
            console.error(" Erro ao verificar token:", error);
            req.user = null;
            res.locals.user = null;
            res.locals.isAdmin = false;
        }
    } else {
        req.user = null;
        res.locals.user = null;
        res.locals.isAdmin = false;
    }

    next();
});


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(" MongoDB conectado!"))
    .catch(err => console.error("Erro ao conectar MongoDB", err));


app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/history", protect, (req, res) => res.render("history", { user: req.user }));
app.get("/ticket/:id", protect, (req, res) => res.render("ticket", { ticketId: req.params.id }));

app.get("/", async (req, res) => {
    try {
        const tickets = await Ticket.find().lean();
        res.render("home", { title: "Página Inicial", tickets });
    } catch (error) {
        res.status(500).send("Erro ao carregar ingressos");
    }
});

app.get("/profile", protect, (req, res) => {
    res.render("profile"); 
});


app.use("/api/users", userRoutes);
app.use("/api/tickets", protect, ticketRoutes);
app.use("/api/auth", userRoutes);


app.get("/admin/painel", protect, async (req, res) => {
    if (req.user && req.user.isAdmin) {
        try {
            const tickets = await Ticket.find().lean(); 
            res.render("adminPanel", { title: "Painel de Administração", tickets }); 
        } catch (error) {
            console.error("Erro ao carregar ingressos no painel admin:", error);
            res.status(500).send("Erro ao carregar ingressos");
        }
    } else {
        res.status(403).send("Acesso negado. Somente administradores.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
});
