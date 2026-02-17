let isWatering = false;
let mode = "Automatic"; // Manual | Automatic | Schedule

// Helpers
const randomBetween = (min, max) =>
  Math.random() * (max - min) + min;

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, value));

function startSimulation(db) {
  setInterval(() => {
    db.all("SELECT * FROM plants", [], (err, plants) => {
      if (err) return;

      plants.forEach((plant) => {
        let moisture = plant.moisture;
        let temperature = plant.temperature;
        let humidity = plant.humidity;

        // 🌡 Natural fluctuation
        temperature += randomBetween(-0.3, 0.3);
        humidity += randomBetween(-0.10, 0.3);

        // 🤖 Automatic Mode
        const autoWater =
          mode === "Automatic" && moisture < 35;

        const wateringNow = isWatering || autoWater;

        if (wateringNow) {
          // 💧 Slowly increase moisture
          moisture += randomBetween(1, 2);
          humidity += 0.8;
        } else {
          // 🌱 Slowly decrease moisture
          moisture -= randomBetween(0.3, 0.8);
          humidity -= 0.4;
        }

        moisture = clamp(moisture, 10, 100);
        temperature = clamp(temperature, 20, 40);
        humidity = clamp(humidity, 10, 90);

        db.run(
          `UPDATE plants 
           SET moisture=?, temperature=?, humidity=? 
           WHERE id=?`,
          [moisture, temperature, humidity, plant.id]
        );
      });
    });
  }, 2000); // update every 2 seconds
}

// Manual Pump Control
function startWatering(durationSeconds = null) {
  isWatering = true;

  if (durationSeconds) {
    setTimeout(() => {
      isWatering = false;
    }, durationSeconds * 1000);
  }
}

function stopWatering() {
  isWatering = false;
}

function setMode(newMode) {
  mode = newMode;
}

module.exports = {
  startSimulation,
  startWatering,
  stopWatering,
  setMode,
};
