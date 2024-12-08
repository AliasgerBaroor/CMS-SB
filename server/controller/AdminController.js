const router = require("express").Router();
const adminClient = require("../models/Admin");
const { validatePassword } = require("../utils/auth");
const jwt = require("jsonwebtoken")
const redisClient = require("../utils/redisClient")
const { generateRegistrationOptions } = require("@simplewebauthn/server")

const crypto = require("crypto");
globalThis.crypto = crypto;

router.post("/", async (req, res) => {
    const { email, password } = req.body
    const response_find_admin = await adminClient.findOne({ email })
    if (response_find_admin) {
        const validPassword = await validatePassword(password, response_find_admin.password)

        if(validPassword) {
            const _id = response_find_admin._id
            const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '1h' })
            
            res.status(200).json({ message: "User login successfully!", token })
        } else {
        res.status(401).json({ message: "Username or Password is incorrect!" })
        }
    } else {
        res.status(401).json({ message: "Username or Password is incorrect!" })
    }
})

router.post("/register-challenge", async (req, res) => {

    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminId = decoded._id;
        
        let radminData = await redisClient.hgetall(`admins:${adminId}`);
        if (!radminData) {
            console.log("Admin data not found in Redis, fetching from MongoDB...");
            const adminData = await adminClient.findById(adminId).lean();
            if (!adminData) {
                return res.status(404).json({ error: "Admin not found" });
            }

            for (const [key, value] of Object.entries(adminData)) {
                await redisClient.hset(`admins:${adminId}`, key, value);
            }

            radminData = adminData;
        }
        if(!radminData._id) return res.status(404).json({ error: "User not found!" });

            
        const challengePayload = await generateRegistrationOptions({
            rpID: "localhost12", 
            rpName: "CMS",
            userName: radminData.email,
            userID: Buffer.from(radminData._id, 'utf-8'), 
            timeout: 30_000,
            challenge: crypto.randomBytes(32), 
        });
        
        challengePayload.challenge = challengePayload.challenge.toString('base64url');

        await redisClient.hset(`challenge:${adminId}`, "challenge", challengePayload.challenge);
        
        await redisClient.expire(`challenge:${adminId}`, 300); 
        
        console.log(`Challenge stored in Redis for admin ${adminId}:`, challengePayload.challenge);
        

        // console.log("Admin data from Redis:", radminData);
        res.status(200).json({ options: challengePayload });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }

});

router.get("/generate/key", async (req, res) => {
    try {
        const { type } = req.query;

        const { default: cryptoRandomString } = await import('crypto-random-string');
        const key = cryptoRandomString({ length: 100, type: "alphanumeric" });

        // Store the key in Redis with a TTL of 5 minutes (300 seconds)
        await redisClient.set(key, JSON.stringify({ type, createdAt: Date.now() }), "EX", 300);

        res.status(200).json({ key,type, message: "Key generated and stored in Redis!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate key" });
    }
});

router.delete("/remove/key", async (req, res) => {
    const { key } = req.query;
    await redisClient.del(key);

    res.status(200).json({ message: "Key removed from Redis!" })

})

router.post("/validate/key", async (req, res) => {
    const { key } = req.body;
    const redisKey = await redisClient.get(key);

    if( redisKey === key ) {
        res.status(200).json({ message: "Key is valid!" })
    } else if(!redisKey || !key ) {
        res.status(404).json({ message: "Key not found in Redis!" })
    } else {
        res.status(400).json({ message: "Key is valid!" })
    }
})

module.exports = router;