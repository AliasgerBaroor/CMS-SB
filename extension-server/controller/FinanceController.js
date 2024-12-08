const router = require("express").Router();
const TexationCLient = require("../models/taxation/Taxation")

router.post("/create", async (req, res) => {
    const body = req.body;
    try {
        const response_create_texation = await TexationCLient.create(body);
        console.log(response_create_texation)
        res.status(201).json(response_create_texation);
    } catch (err) {
        
    }
})

router.get("/view/all", async (req, res) => {
    try {
        const response_view_all_texations = await TexationCLient.find({});
        res.status(200).json(response_view_all_texations);
    } catch (err) {
        
    }
})
router.get("/view/:id", async (req, res) => {
    const _id = req.params.id;
    try {
        const response_view_texations_by_id = await TexationCLient.find({_id});
        res.status(200).json(response_view_texations_by_id[0]);
    } catch (err) {
        res.status(404).json({ error: "Not data found" });
    }
})

module.exports = router