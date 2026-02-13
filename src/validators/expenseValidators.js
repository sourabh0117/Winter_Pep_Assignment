const { body, param, validationResult } = require("express-validator");

const expenseValidators = {
  validateCreateExpense: [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters"),

    body("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),

    body("amount")
      .notEmpty()
      .withMessage("Amount is required")
      .isNumeric()
      .withMessage("Amount must be a valid number")
      .custom((value) => {
        if (value <= 0) {
          throw new Error("Amount must be greater than 0");
        }
        return true;
      }),

    body("currency")
      .optional()
      .isIn(["INR", "USD", "EUR"])
      .withMessage("Currency must be INR, USD, or EUR"),

    body("groupId")
      .notEmpty()
      .withMessage("Group ID is required")
      .isMongoId()
      .withMessage("Invalid group ID"),

    body("splitDetails")
      .isArray({ min: 1 })
      .withMessage("Split details must be an array with at least one member"),

    body("splitDetails.*.memberEmail")
      .isEmail()
      .withMessage("Each split detail must have a valid member email"),

    body("splitDetails.*.amount")
      .isNumeric()
      .withMessage("Each split amount must be a valid number")
      .custom((value) => {
        if (value < 0) {
          throw new Error("Split amount cannot be negative");
        }
        return true;
      }),

    body("category")
      .optional()
      .isIn([
        "General",
        "Food",
        "Transportation",
        "Entertainment",
        "Utilities",
        "Shopping",
        "Other",
      ])
      .withMessage("Invalid category"),

    body().custom((req) => {
      const { amount, splitDetails } = req;
      if (splitDetails && amount) {
        const totalSplit = splitDetails.reduce(
          (sum, split) => sum + parseFloat(split.amount),
          0,
        );
        if (Math.abs(totalSplit - parseFloat(amount)) > 0.01) {
          throw new Error("Split details total must equal the expense amount");
        }
      }
      return true;
    }),
  ],

  validateUpdateExpense: [
    param("expenseId").isMongoId().withMessage("Invalid expense ID"),

    body("title")
      .optional()
      .isLength({ max: 100 })
      .withMessage("Title must be less than 100 characters"),

    body("description")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),

    body("amount")
      .optional()
      .isNumeric()
      .withMessage("Amount must be a valid number")
      .custom((value) => {
        if (value && value <= 0) {
          throw new Error("Amount must be greater than 0");
        }
        return true;
      }),

    body("splitDetails")
      .optional()
      .isArray({ min: 1 })
      .withMessage("Split details must be an array with at least one member"),
  ],

  validateGroupId: [
    param("groupId").isMongoId().withMessage("Invalid group ID"),
  ],

  validateExpenseId: [
    param("expenseId").isMongoId().withMessage("Invalid expense ID"),
  ],

  handleValidationErrors: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation errors",
        errors: errors.array(),
      });
    }
    next();
  },
};

module.exports = expenseValidators;
