const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  adminEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  membersEmail: [String],
  thumbnail: { type: String, required: false },
  paymentStatus: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: "INR" },
    date: { type: Date, default: Date.now },
    isPaid: { type: Boolean, default: false },
  },
  lastSettledAt: { type: Date },
  totalExpenses: { type: Number, default: 0 },
  settledBy: { type: String }, 
});

module.exports = mongoose.model("Group", groupSchema);
