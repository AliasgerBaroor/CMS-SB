const router = require("express").Router();

router.use("/api/v1/finance", require("../controller/FinanceController"))

module.exports = router
