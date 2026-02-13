const Expense = require("../model/expense");

const expenseDao = {
  createExpense: async (data) => {
    const newExpense = new Expense(data);
    return await newExpense.save();
  },

  updateExpense: async (data) => {
    const {
      expenseId,
      title,
      description,
      amount,
      currency,
      splitDetails,
      category,
    } = data;

    return await Expense.findByIdAndUpdate(
      expenseId,
      {
        title,
        description,
        amount,
        currency,
        splitDetails,
        category,
      },
      { new: true },
    );
  },

  getExpensesByGroup: async (groupId) => {
    return await Expense.find({ groupId }).sort({ createdAt: -1 });
  },

  getExpenseById: async (expenseId) => {
    return await Expense.findById(expenseId);
  },

  deleteExpense: async (expenseId) => {
    return await Expense.findByIdAndDelete(expenseId);
  },

  getExpensesByUser: async (userEmail) => {
    return await Expense.find({
      $or: [{ paidBy: userEmail }, { "splitDetails.memberEmail": userEmail }],
    }).sort({ createdAt: -1 });
  },

  settleGroupExpenses: async (groupId) => {
    return await Expense.updateMany(
      { groupId },
      {
        $set: {
          isSettled: true,
          "splitDetails.$[].isPaid": true,
        },
      },
    );
  },

  calculateGroupBalance: async (groupId) => {
    const expenses = await Expense.find({ groupId, isSettled: false });
    const balances = {};

    expenses.forEach((expense) => {
      // Initialize paidBy user if not exists
      if (!balances[expense.paidBy]) {
        balances[expense.paidBy] = 0;
      }

      // Person who paid gets credit for the full amount
      balances[expense.paidBy] += expense.amount;

      // Each person in split owes their portion
      expense.splitDetails.forEach((split) => {
        if (!balances[split.memberEmail]) {
          balances[split.memberEmail] = 0;
        }
        balances[split.memberEmail] -= split.amount;
      });
    });

    return balances;
  },
};

module.exports = expenseDao;
