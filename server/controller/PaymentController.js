const router = require("express").Router();

const instance = require("../server")
const crypto = require("crypto")
const PaymentClient = require("../models/Payment")
require("dotenv").config("../")

router.get("/getkey", (req, res) => res.status(200).json({key : process.env.RAZORPAY_API_KEY}))

router.post("/checkout", async (req, res) => {
    const options = {
        amount: Number((req.body.amount * 100) * 84),  // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11"
      };
      const order = await instance.orders.create(options);
      res.status(200).json({
        success : true,
        order,
      })
})

router.post("/payment/verification", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
    // Database comes here

    await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    });

    res.redirect(
        `http://localhost:3000/admin/v1/paymentsuccess?reference=${razorpay_payment_id}`
    );
    } else {
    res.status(400).json({
        success: false,
    });
    }
})

module.exports = router

