let isWatering = false;
let mode = "Automatic"; // Manual | Automatic | Schedule

let totalWaterUsedSession = 0;
let totalWaterWastedSession = 0;

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
        let waterUsage = plant.waterUsage;

        // 🌡 Natural fluctuation
        temperature += randomBetween(-0.5, 0.3);
        humidity += randomBetween(-0.10, 0.5);

        // 🤖 Automatic Mode
        const autoWater =
          mode === "Automatic" && moisture < 35;

        const wateringNow = isWatering || autoWater;

        if (wateringNow) {
          // 💧 Slowly increase moisture
          moisture += randomBetween(1, 2);
          humidity += 0.8;
          
          const waterThisTick = 0.2;
          waterUsage += waterThisTick; // Track individual plant water usage
          
          // Track overall efficiency for conservation score
          totalWaterUsedSession += waterThisTick;
          if (moisture > 65) {
             // Watering a plant that is already sufficiently wet is considered "waste"
             totalWaterWastedSession += waterThisTick;
          }
        } else {
          // 🌱 Slowly decrease moisture
          moisture -= randomBetween(0.3, 0.8);
          humidity -= 0.4;
        }

        moisture = clamp(moisture, 10, 100);
        temperature = clamp(temperature, 20, 40);
        humidity = clamp(humidity, 10, 90);
        waterUsage = clamp(plant.waterUsage + (wateringNow ? 0.2 : 0), 0, 3000);

        db.run(
          `UPDATE plants 
           SET moisture=?, temperature=?, humidity=?, waterUsage=?
           WHERE id=?`,
          [moisture, temperature, humidity, waterUsage, plant.id]
        );
      });

      // Update system_stats
      db.get("SELECT SUM(waterUsage) as totalWater FROM plants", [], (err, row) => {
        if (!err && row) {
          const totalWater = row.totalWater || 0;
          
          let conservationScore = 100;
          if (totalWaterUsedSession > 0) {
            const wasteRatio = totalWaterWastedSession / totalWaterUsedSession;
            conservationScore = Math.max(0, 100 - (wasteRatio * 100));
          }
          
          db.run(
            `UPDATE system_stats SET totalWaterUsage = ?, conservationScore = ? WHERE id = 1`,
            [totalWater, conservationScore]
          );
        }
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
