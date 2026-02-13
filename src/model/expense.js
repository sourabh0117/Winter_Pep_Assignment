const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  paidBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  splitDetails: [
    {
      memberEmail: { type: String, required: true },
      amount: { type: Number, required: true },
      isPaid: { type: Boolean, default: false },
    },
  ],
  category: { type: String, default: "General" },
  isSettled: { type: Boolean, default: false },
});

module.exports = mongoose.model("Expense", expenseSchema);
