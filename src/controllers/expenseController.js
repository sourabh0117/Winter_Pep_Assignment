const expenseDao = require("../dao/expenseDao");
const groupDao = require("../dao/groupDao");

const expenseController = {
  create: async (request, response) => {
    try {
      const user = request.user;
      const {
        title,
        description,
        amount,
        currency,
        groupId,
        splitDetails,
        category,
      } = request.body;

      const groups = await groupDao.getGroupByEmail(user.email);
      const targetGroup = groups.find(
        (group) => group._id.toString() === groupId,
      );

      if (!targetGroup) {
        return response
          .status(403)
          .json({ message: "You are not a member of this group" });
      }

      const newExpense = await expenseDao.createExpense({
        title,
        description,
        amount,
        currency: currency || "INR",
        groupId,
        paidBy: user.email,
        splitDetails,
        category: category || "General",
      });

      response.status(201).json({
        message: "Expense created successfully",
        expense: newExpense,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  update: async (request, response) => {
    try {
      const user = request.user;
      const { expenseId } = request.params;

      const existingExpense = await expenseDao.getExpenseById(expenseId);
      if (!existingExpense) {
        return response.status(404).json({ message: "Expense not found" });
      }

      if (existingExpense.paidBy !== user.email) {
        return response
          .status(403)
          .json({ message: "You can only edit expenses you created" });
      }

      const updatedExpense = await expenseDao.updateExpense({
        expenseId,
        ...request.body,
      });

      response.status(200).json({
        message: "Expense updated successfully",
        expense: updatedExpense,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  getByGroup: async (request, response) => {
    try {
      const user = request.user;
      const { groupId } = request.params;

      const groups = await groupDao.getGroupByEmail(user.email);
      const targetGroup = groups.find(
        (group) => group._id.toString() === groupId,
      );

      if (!targetGroup) {
        return response
          .status(403)
          .json({ message: "You are not a member of this group" });
      }

      const expenses = await expenseDao.getExpensesByGroup(groupId);
      response.status(200).json(expenses);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  getById: async (request, response) => {
    try {
      const { expenseId } = request.params;
      const expense = await expenseDao.getExpenseById(expenseId);

      if (!expense) {
        return response.status(404).json({ message: "Expense not found" });
      }

      response.status(200).json(expense);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  delete: async (request, response) => {
    try {
      const user = request.user;
      const { expenseId } = request.params;

      const existingExpense = await expenseDao.getExpenseById(expenseId);
      if (!existingExpense) {
        return response.status(404).json({ message: "Expense not found" });
      }

      if (existingExpense.paidBy !== user.email) {
        return response
          .status(403)
          .json({ message: "You can only delete expenses you created" });
      }

      await expenseDao.deleteExpense(expenseId);
      response.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  getGroupBalance: async (request, response) => {
    try {
      const user = request.user;
      const { groupId } = request.params;

      const groups = await groupDao.getGroupByEmail(user.email);
      const targetGroup = groups.find(
        (group) => group._id.toString() === groupId,
      );

      if (!targetGroup) {
        return response
          .status(403)
          .json({ message: "You are not a member of this group" });
      }

      const balances = await expenseDao.calculateGroupBalance(groupId);
      response.status(200).json({
        groupId,
        balances,
        groupDetails: targetGroup,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  settleGroup: async (request, response) => {
    try {
      const user = request.user;
      const { groupId } = request.params;

      const groups = await groupDao.getGroupByEmail(user.email);
      const targetGroup = groups.find(
        (group) => group._id.toString() === groupId,
      );

      if (!targetGroup) {
        return response
          .status(403)
          .json({ message: "You are not a member of this group" });
      }

      if (targetGroup.adminEmail !== user.email) {
        return response
          .status(403)
          .json({ message: "Only group admin can settle the group" });
      }

      const expenses = await expenseDao.getExpensesByGroup(groupId);
      const totalExpenseAmount = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );

      await expenseDao.settleGroupExpenses(groupId);

      await groupDao.updateGroup({
        groupId,
        paymentStatus: {
          amount: totalExpenseAmount,
          currency: "INR",
          date: new Date(),
          isPaid: true,
        },
        lastSettledAt: new Date(),
        totalExpenses: totalExpenseAmount,
        settledBy: user.email,
      });

      response.status(200).json({
        message: "Group settled successfully",
        totalAmount: totalExpenseAmount,
        expenseCount: expenses.length,
      });
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },

  getUserExpenses: async (request, response) => {
    try {
      const user = request.user;
      const expenses = await expenseDao.getExpensesByUser(user.email);
      response.status(200).json(expenses);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = expenseController;
