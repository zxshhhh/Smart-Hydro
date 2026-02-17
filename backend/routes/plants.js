const express = require("express");
const router = express.Router();
const db = require("../database");

// Get all plants
router.get("/", (req, res) => {
  db.all("SELECT * FROM plants", [], (err, rows) => {
    res.json(rows);
  });
});

// Manual Water
router.post("/:id/water", (req, res) => {
  const { duration } = req.body;
  const waterAmount = duration * 0.1;

  db.run(`
    UPDATE plants
    SET moisture = moisture + 15,
        waterUsage = waterUsage + ?
    WHERE id = ?
  `, [waterAmount, req.params.id]);

  res.json({ message: "Watering successful" });
});

module.exports = router;
