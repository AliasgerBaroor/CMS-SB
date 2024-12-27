const router = require("express").Router();
const ExpenseCLient = require("../models/finance/Expense")

router.post("/", async (req, res) => {
    const response_add_expense = await ExpenseCLient.create(req.body);
    res.status(201).json(response_add_expense)
})

router.get("/all", async (req, res) => {
    const response_find_all_expense = await ExpenseCLient.find({});
    res.status(200).json(response_find_all_expense)
})

module.exports = router
