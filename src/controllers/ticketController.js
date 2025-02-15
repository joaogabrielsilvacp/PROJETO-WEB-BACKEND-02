
const Ticket = require("../models/ticketModel");


exports.createTicket = async (req, res) => {
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
};


exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar ingressos", error: error.message });
    }
};


exports.getTicketById = async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: "Ingresso não encontrado" });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: "Erro ao obter ingresso", error: error.message });
    }
};


exports.updateTicket = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Acesso negado. Somente administradores." });
    }

    const { ticketId } = req.params;
    const { name, price, quantity } = req.body;

    try {
        const ticket = await Ticket.findById(ticketId);
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
};


exports.deleteTicket = async (req, res) => {
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
};
