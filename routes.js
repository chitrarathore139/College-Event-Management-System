const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");

// Register for Event
router.post("/register", async (req, res) => {
  const { eventId, userId } = req.body;

  try {
    const alreadyRegistered = await Registration.findOne({ eventId, userId });

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered" });
    }

    const registration = new Registration({ eventId, userId });
    await registration.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
