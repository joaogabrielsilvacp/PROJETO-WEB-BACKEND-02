const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
});

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
