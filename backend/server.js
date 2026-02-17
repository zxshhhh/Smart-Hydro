const express = require("express");
const cors = require("cors");
const db = require("./database");
const plantRoutes = require("./routes/plants");
const systemRoutes = require("./routes/system");
const engine = require("./simulation/engine");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/plants", plantRoutes);
app.use("/system", systemRoutes);
// Set Mode
app.post("/mode", (req, res) => {
  const { mode } = req.body;
  engine.setMode(mode);
  res.json({ message: "Mode updated" });
});
// Manual ON
app.post("/water/on", (req, res) => {
  engine.startWatering();
  res.json({ message: "Watering started" });
});
// Manual OFF
app.post("/water/off", (req, res) => {
  engine.stopWatering();
  res.json({ message: "Watering stopped" });
});
// Duration Watering
app.post("/water/duration", (req, res) => {
  const { seconds } = req.body;
  engine.startWatering(seconds);
  res.json({ message: `Watering for ${seconds} seconds` });
});

engine.startSimulation(db);

app.listen(5000, () => {
  console.log("🌱 Smart Hydro Backend running on port 5000");
});
