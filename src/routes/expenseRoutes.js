const express = require("express");
const expenseController = require("../controllers/expenseController");
const authMiddleware = require("../middlewares/authMiddleware");
const expenseValidators = require("../validators/expenseValidators");

const router = express.Router();

router.use(authMiddleware.protect);

router.post(
  "/create",
  expenseValidators.validateCreateExpense,
  expenseValidators.handleValidationErrors,
  expenseController.create,
);

router.put(
  "/:expenseId/update",
  expenseValidators.validateUpdateExpense,
  expenseValidators.handleValidationErrors,
  expenseController.update,
);

router.delete(
  "/:expenseId/delete",
  expenseValidators.validateExpenseId,
  expenseValidators.handleValidationErrors,
  expenseController.delete,
);

router.get(
  "/group/:groupId",
  expenseValidators.validateGroupId,
  expenseValidators.handleValidationErrors,
  expenseController.getByGroup,
);

router.get(
  "/:expenseId",
  expenseValidators.validateExpenseId,
  expenseValidators.handleValidationErrors,
  expenseController.getById,
);

router.get(
  "/group/:groupId/balance",
  expenseValidators.validateGroupId,
  expenseValidators.handleValidationErrors,
  expenseController.getGroupBalance,
);

router.post(
  "/group/:groupId/settle",
  expenseValidators.validateGroupId,
  expenseValidators.handleValidationErrors,
  expenseController.settleGroup,
);

router.get("/my-expenses", expenseController.getUserExpenses);

module.exports = router;
