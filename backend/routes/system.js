const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/stats", (req, res) => {
  db.get("SELECT * FROM system_stats WHERE id = 1", [], (err, row) => {
    res.json(row || { totalWaterUsage: 0, conservationScore: 100 });
  });
});

router.get("/insight", (req, res) => {
  db.all("SELECT * FROM plants", [], (err, plants) => {
    let insight = "All plants are healthy 🌱";

    plants.forEach(p => {
      if (p.moisture < 35)
        insight = `⚠ ${p.name} soil is critically dry`;
    });

    res.json({ insight });
  });
});

module.exports = router;
