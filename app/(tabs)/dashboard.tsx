import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from "react-native";
import axios from "axios";
import Slider from "@react-native-community/slider";
import DateTimePicker from "@react-native-community/datetimepicker";
import SensorStatusCard from "@/components/sensorStatusCard";
import AIInsightCard from "@/components/aiInsightCard";

interface Plant {
  id: string;
  name: string;
  temperature: number;
  moisture: number;
  humidity: number;
  waterUsage: number;
}

export default function DashboardPage() {
  const [mode, setMode] = useState("Automatic");
  const [duration, setDuration] = useState(5);
  const [isWatering, setIsWatering] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [repeatDaily, setRepeatDaily] = useState(true);
  const [scheduleDuration, setScheduleDuration] = useState(5);
  const [plants, setPlants] = useState([]);

  const DATA_URL = "http://192.168.1.13:5000";

  const fetchPlants = async () => {
    try {
      const res = await axios.get(`${DATA_URL}/plants`);
      setPlants(res.data);
    } catch (err) {
      console.log("Error fetching plants:", err.message);
    }
  };

  useEffect(() => {
    fetchPlants();
    const interval = setInterval(fetchPlants, 2000); // live refresh
    return () => clearInterval(interval);
  }, []);

  const handlePumpOn = async () => {
    setIsWatering(true);
    await axios.post(`${DATA_URL}/water/on`);
  };

  const handlePumpOff = async () => {
    setIsWatering(false);
    await axios.post(`${DATA_URL}/water/off`);
  };

  const handleDurationWater = async () => {
    setIsWatering(true);

    await axios.post(`${DATA_URL}/water/duration`, {
      seconds: duration * 60,
    });

    setTimeout(() => {
      setIsWatering(false);
    }, duration * 60000);
  };

  const renderModeButton = (type: any) => {
    const active = mode === type;

    return (
      <TouchableOpacity
        key={type}
        onPress={async () => {
          setMode(type);
          await axios.post(`${DATA_URL}/mode`, { mode: type });
        }}
        style={[
          styles.modeButton,
          active && styles.modeButtonActive,
        ]}
      >
        <Text
          style={[
            styles.modeText,
            active && styles.modeTextActive,
          ]}
        >
          {type}
        </Text>
      </TouchableOpacity>
    );
  };

  const sensorStatus = React.useMemo(() => {
    if (!plants.length) return [];

    const avg = (key: string) =>
      plants.reduce((sum, p) => sum + (p[key] || 0), 0) / plants.length;

    return [
      {
        key: "moisture",
        title: "Soil Moisture",
        value: avg("moisture"),
        unit: "%",
        icon: "💧",
        min: 30,
        max: 60,
      },
      {
        key: "temperature",
        title: "Temperature",
        value: avg("temperature"),
        unit: "°C",
        icon: "🌡",
        min: 18,
        max: 30,
      },
      {
        key: "humidity",
        title: "Humidity",
        value: avg("humidity"),
        unit: "%",
        icon: "💨",
        min: 40,
        max: 70,
      },
      {
        key: "waterTank",
        title: "Water Tank",
        value: plants[0]?.waterUsage
          ? Math.max(0, 100 - plants[0].waterUsage * 10)
          : 100,
        unit: "%",
        icon: "🚰",
        min: 20,
        max: 100,
      },
    ];
  }, [plants]);

  return (
    <View style={styles.body}>
      <ScrollView style={styles.container}>
        {/* Mode Selector */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Watering Mode</Text>
          <View style={styles.modeContainer}>
            {["Manual", "Automatic", "Schedule"].map(renderModeButton)}
          </View>
          {/* ===================== MANUAL MODE ===================== */}
          {mode === "Manual" && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Manual Pump Control</Text>
              <View style={styles.manualButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.pumpButton,
                    isWatering && styles.activePump,
                  ]}
                  onPress={handlePumpOn}
                >
                  <Text style={styles.pumpText}>ON</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pumpButtonOff}
                  onPress={handlePumpOff}
                >
                  <Text style={styles.pumpText}>OFF</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.durationLabel}>
                Auto Stop Duration: {duration}m
              </Text>
              <Slider
                minimumValue={1}
                maximumValue={5}
                step={1}
                value={duration}
                onValueChange={setDuration}
                minimumTrackTintColor="#22C55E"
                maximumTrackTintColor="#334155"
                thumbTintColor="#22C55E"
              />
              <TouchableOpacity
                style={styles.autoDurationButton}
                onPress={handleDurationWater}
              >
                <Text style={styles.autoDurationText}>
                  💧 Water For Duration
                </Text>
              </TouchableOpacity>

              {isWatering && (
                <Text style={styles.wateringStatus}>
                  💧 Pump is Running...
                </Text>
              )}
            </View>
          )}
          {/* ===================== SCHEDULE MODE ===================== */}
          {mode === "Schedule" && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Schedule Setup</Text>

              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.timeText}>
                  ⏰ {scheduleTime.toLocaleTimeString()}
                </Text>
              </TouchableOpacity>
              {showPicker && (
                <DateTimePicker
                  value={scheduleTime}
                  mode="time"
                  is24Hour={true}
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowPicker(false);
                    if (selectedDate) setScheduleTime(selectedDate);
                  }}
                />
              )}
              <View style={styles.repeatRow}>
                <Text style={styles.repeatText}>Repeat Daily</Text>
                <Switch
                  value={repeatDaily}
                  onValueChange={setRepeatDaily}
                />
              </View>
              <Text style={styles.durationLabel}>
                Duration: {scheduleDuration}s
              </Text>
              <Slider
                minimumValue={1}
                maximumValue={30}
                step={1}
                value={scheduleDuration}
                onValueChange={setScheduleDuration}
                minimumTrackTintColor="#38BDF8"
                maximumTrackTintColor="#334155"
                thumbTintColor="#38BDF8"
              />
              <View style={styles.scheduleSummary}>
                <Text style={styles.summaryText}>
                  📅 Scheduled at {scheduleTime.toLocaleTimeString()}
                </Text>
                <Text style={styles.summaryText}>
                  🔁 {repeatDaily ? "Repeats Daily" : "One-time Only"}
                </Text>
                <Text style={styles.summaryText}>
                  💧 Duration: {scheduleDuration}s
                </Text>
              </View>
            </View>
          )}
        </View>
        {/* Sensor Overview */}
        <Text style={styles.sectionTitle}>Live Environment</Text>
        {plants.map((plant) => (
          <View key={plant.id} style={styles.card}>
            <Text style={styles.plantName}>{plant.name}</Text>
            <View style={styles.sensorRow}>
              <View style={styles.sensorCard}>
                <Text style={styles.sensorLabel}>Soil Moisture</Text>
                <Text style={styles.sensorValue}>
                  {plant.moisture?.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.sensorCard}>
                <Text style={styles.sensorLabel}>Temperature</Text>
                <Text style={styles.sensorValue}>
                  {plant.temperature?.toFixed(1)}°C
                </Text>
              </View>
              <View style={styles.sensorCard}>
                <Text style={styles.sensorLabel}>Humidity</Text>
                <Text style={styles.sensorValue}>
                  {plant.humidity?.toFixed(1)}%
                </Text>
              </View>
            </View>
            <Text style={styles.plantHealth}>Plant Status:
              {plant.moisture > 40
                ? " 🟢 Healthy"
                : " 🔴 Needs Water"}
            </Text>
          </View>
        ))}
        {/* System Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>System Summary</Text>
          <Text style={styles.summaryText}>💧 Water Today: 1.4L</Text>
          <Text style={styles.summaryText}>🧠 Conservation Score: 92%</Text>
        </View>
        <Text style={styles.sectionTitle}>Sensor Status</Text>
        <View style={styles.sensorGrid}>
          {sensorStatus.map((sensor) => (
            <SensorStatusCard
              key={sensor.key}
              title={sensor.title}
              value={sensor.value}
              unit={sensor.unit}
              icon={sensor.icon}
              min={sensor.min}
              max={sensor.max}
            />
          ))}
        </View>
        <AIInsightCard
          moisture={plants.moisture}
          temperature={plants.temperature}
          humidity={plants.humidity}
          onApply={() => {
            fetchPlants(); // example
          }}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    padding: 20,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "bold",
  },
  status: {
    color: "#94A3B8",
    marginTop: 5,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#121A2B",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  modeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#1E293B",
    marginHorizontal: 5,
  },
  modeButtonActive: {
    backgroundColor: "#22C55E",
  },
  modeText: {
    color: "#94A3B8",
    fontWeight: "500",
  },
  modeTextActive: {
    color: "#0B1220",
    fontWeight: "bold",
  },
  sensorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sensorCard: {
    backgroundColor: "#121A2B",
    padding: 15,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  sensorLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },
  sensorValue: {
    color: "#22C55E",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  plantName: {
    color: "#22C55E",
    fontSize: 18,
    fontWeight: "bold",
  },
  plantHealth: {
    color: "#94A3B8",
    marginTop: 5,
  },
  summaryText: {
    color: "#94A3B8",
    marginBottom: 5,
  },
  durationLabel: {
    color: "#94A3B8",
    marginBottom: 5,
  },
  waterButton: {
    backgroundColor: "#22C55E",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  waterButtonText: {
    color: "#0B1220",
    fontWeight: "bold",
  },
  scheduleText: {
    color: "#94A3B8",
  },
  scheduleSummary: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
  },
  repeatText: {
    color: "#FFFFFF",
  },
  repeatRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  timeText: {
    color: "#FFFFFF",
  },
  timeButton: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  wateringStatus: {
    color: "#22C55E",
    marginTop: 10,
  },
  autoDurationText: {
    color: "#0B1220",
    fontWeight: "bold",
  },
  autoDurationButton: {
    backgroundColor: "#38BDF8",
    padding: 12,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  pumpText: {
    color: "#0B1220",
    fontWeight: "bold",
  },
  activePump: {
    backgroundColor: "#16A34A",
  },
  pumpButtonOff: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  pumpButton: {
    flex: 1,
    backgroundColor: "#22C55E",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginRight: 10,
  },
  manualButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sensorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
})