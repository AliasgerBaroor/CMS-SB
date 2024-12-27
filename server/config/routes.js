const router = require("express").Router();

router.use("/api/v1/admin", require("../controller/AdminController"))
router.use("/api/v1/cms/", require("../controller/CmsController"))
router.use("/api/v1/chat/", require("../controller/ChatController"))
router.use("/api/v1/payment/", require("../controller/PaymentController"))

module.exports = router
