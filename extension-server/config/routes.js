const router = require("express").Router();

router.use("/api/v1/finance", require("../controller/FinanceController"))
router.use("/api/v1/finance/expense", require("../controller/FinanceExpenseController"))

module.exports = router
