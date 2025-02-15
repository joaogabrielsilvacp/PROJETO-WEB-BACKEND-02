const express = require("express");
const Ticket = require("../models/ticketModel");
const User = require("../models/user");
const { protect, adminMiddleware } = require("../middlewares/authMiddleware");
const Purchase = require("../models/purchaseModel");

const router = express.Router();


router.post("/", protect, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Acesso negado. Somente administradores." });
    }

    try {
        const { name, price, quantity } = req.body;

        const newTicket = new Ticket({
            name,
            price,
            quantity,  
        });

        await newTicket.save();
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar ingresso", error: error.message });
    }
});


router.put("/:id", protect, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Acesso negado. Somente administradores." });
    }

    const { id } = req.params;
    const { name, price, quantity } = req.body;

    try {
        const ticket = await Ticket.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: "Ingresso não encontrado" });
        }


        ticket.name = name || ticket.name;
        ticket.price = price || ticket.price;
        ticket.quantity = quantity || ticket.quantity;  

        
        await ticket.save();

        
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: "Erro ao editar ingresso", error: error.message });
    }
});


router.delete("/:id", protect, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Acesso negado. Somente administradores." });
    }

    const { id } = req.params;

    try {
        const ticket = await Ticket.findByIdAndDelete(id);
        if (!ticket) {
            return res.status(404).json({ message: "Ingresso não encontrado" });
        }

        res.json({ message: "Ingresso deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar ingresso", error: error.message });
    }
});


router.post("/purchase", protect, async (req, res) => {
    try {
        let { ticketId, quantity } = req.body;

        
        quantity = Number(quantity);

        if (!quantity || isNaN(quantity) || quantity <= 0 || !Number.isInteger(quantity)) {
        return res.status(400).json({ message: "Quantidade inválida! Deve ser um número inteiro positivo." });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ingresso não encontrado" });
        }

        if (ticket.quantity < quantity) {
            return res.status(400).json({ message: "Quantidade de ingressos insuficiente" });
        }

        ticket.quantity -= quantity;
        await ticket.save();

        const newPurchase = new Purchase({
            userId: req.user.id,
            ticketId: ticketId,
            quantity,
            price: ticket.price,
            total: ticket.price * quantity,
        });
        
        await newPurchase.save();

        res.status(200).json({ message: "Compra realizada com sucesso!", ticket });
    } catch (error) {
        res.status(500).json({ message: "Erro ao realizar compra", error: error.message });
    }
});


router.get("/history", protect, async (req, res) => {
    try {
        const purchases = await Purchase.find({ userId: req.user.id }).populate("ticketId");

        res.json(purchases); 
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar histórico de compras", error: error.message });
    }
});


router.get("/", async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar ingressos", error: error.message });
    }
});

module.exports = router;
