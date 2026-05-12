import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBaseUrl } from "../../services/api";

interface Plant {
  id: number;
  name: string;
  mode: string;
 pump_status: boolean;
  schedule_time?: string;
  schedule_duration?: number;
  latest_data?: {
    soil_moisture: number;
    temperature: number;
    humidity: number;
  };
}

export default function DashboardPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scheduleInputs, setScheduleInputs] = useState<{
    [key: number]: {
      time: string;
      duration: string;
    };
  }>({});

  const BASE_URL = getBaseUrl();

  const fetchDashboardData = async () => {
    try {
      setError(null);

      const token = await AsyncStorage.getItem("access_token");

      if (!token) {
        setError(
          "No authentication token found. Please login again."
        );
        setLoading(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/api/v1/plants/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to fetch plants");
      }

      const plantList = Array.isArray(data)
        ? data
        : data.results || [];

      const updatedPlants = await Promise.all(
        plantList.map(async (plant: any) => {
          try {
            const dataRes = await fetch(
              `${BASE_URL}/api/v1/plants/${plant.id}/sensor-data/latest/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            let latest = null;

            if (dataRes.ok) {
              latest = await dataRes.json();
            }

            return {
              ...plant,
              latest_data: latest,
            };
          } catch (err) {
            console.log(
              `Could not fetch latest data for plant ${plant.id}`
            );

            return plant;
          }
        })
      );

      setPlants(updatedPlants);
    } catch (err: any) {
      console.error("Error fetching dashboard:", err);

      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const togglePump = async (
    plantId: number,
    newStatus: boolean
  ) => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      await fetch(`${BASE_URL}/api/v1/plants/${plantId}/pump/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      fetchDashboardData();
    } catch (err) {
      Alert.alert("Error", "Failed to toggle pump");
    }
  };

  const changeMode = async (
    plantId: number,
    newMode: string,
    scheduleTime?: string,
    duration?: number
  ) => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      let payload: any = {
        mode: newMode,
      };

      if (
        newMode === "schedule" &&
        scheduleTime
      ) {
        const formattedTime =
          scheduleTime.length === 5
            ? `${scheduleTime}:00`
            : scheduleTime;

        payload.schedule_time = formattedTime;
        payload.schedule_duration = duration || 5;
      }

      console.log("PAYLOAD:", payload);

      const res = await fetch(
        `${BASE_URL}/api/v1/plants/${plantId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(JSON.stringify(data));
      }

      fetchDashboardData();

      Alert.alert("Success", "Plant mode updated");
    } catch (err: any) {
      console.log(err);

      Alert.alert(
        "Error",
        err.message || "Failed to change mode"
      );
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 500);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22C55E" />

        <Text style={{ color: "#94A3B8", marginTop: 10 }}>
          Loading garden data...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red", fontSize: 16 }}>
          {error}
        </Text>

        <TouchableOpacity
          onPress={fetchDashboardData}
          style={styles.retryButton}
        >
          <Text style={{ color: "#22C55E" }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <ScrollView contentContainerStyle={styles.container}>
        {plants.length === 0 ? (
          <Text style={styles.noData}>
            No plants found. Humanity built smart irrigation
            before remembering the plants part. Stunning work.
          </Text>
        ) : (
          plants.map((plant) => {
            const data = plant.latest_data;

            return (
              <View key={plant.id} style={styles.card}>
                <Text style={styles.plantName}>
                  {plant.name}
                </Text>

                {/* WATERING MODE */}
                <View style={styles.modeContainer}>
                  <Text style={styles.modeTitle}>
                    Watering Mode
                  </Text>

                  <View style={styles.modeButtons}>
                    <TouchableOpacity
                      style={[
                        styles.modeButton,
                        plant.mode === "manual" &&
                          styles.activeMode,
                      ]}
                      onPress={() =>
                        changeMode(plant.id, "manual")
                      }
                    >
                      <Text style={styles.modeButtonText}>
                        Manual
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.modeButton,
                        plant.mode === "automatic" &&
                          styles.activeMode,
                      ]}
                      onPress={() =>
                        changeMode(plant.id, "automatic")
                      }
                    >
                      <Text style={styles.modeButtonText}>
                        Auto
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[ 
                        styles.modeButton, 
                        plant.mode === "schedule" && styles.activeMode, 
                      ]}
                      onPress={() => 
                      changeMode(
                        plant.id, 
                        "schedule"
                      )} 
                    >
                      <Text style={styles.modeButtonText}>
                        Scheduled
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.currentMode}>
                    Current Mode:{" "}
                    <Text style={{ color: "#22C55E" }}>
                      {plant.mode}
                    </Text>
                  </Text>

                  {/* SCHEDULE SETTINGS */}
                  {plant.mode === "schedule" && (
                    <View style={styles.scheduleContainer}>
                      <Text style={styles.scheduleLabel}>
                        Schedule Time (HH:MM)
                      </Text>

                      <TextInput
                        placeholder="07:00"
                        placeholderTextColor="#64748B"
                        value={
                          scheduleInputs[plant.id]?.time ||
                          (plant.schedule_time
                            ? plant.schedule_time.slice(
                                0,
                                5
                              )
                            : "")
                        }
                        onChangeText={(text) =>
                          setScheduleInputs((prev) => ({
                            ...prev,
                            [plant.id]: {
                              ...prev[plant.id],
                              time: text,
                            },
                          }))
                        }
                        style={styles.input}
                      />

                      <Text style={styles.scheduleLabel}>
                        Duration (seconds)
                      </Text>

                      <TextInput
                        placeholder="10"
                        placeholderTextColor="#64748B"
                        keyboardType="numeric"
                        value={
                          scheduleInputs[plant.id]
                            ?.duration ||
                          String(
                            plant.schedule_duration || ""
                          )
                        }
                        onChangeText={(text) =>
                          setScheduleInputs((prev) => ({
                            ...prev,
                            [plant.id]: {
                              ...prev[plant.id],
                              duration: text,
                            },
                          }))
                        }
                        style={styles.input}
                      />

                      <TouchableOpacity
                        style={styles.saveScheduleButton}
                        onPress={() =>
                          changeMode(
                            plant.id,
                            "schedule",
                            scheduleInputs[plant.id]?.time,
                            Number(
                              scheduleInputs[plant.id]
                                ?.duration || 5
                            )
                          )
                        }
                      >
                        <Text
                          style={styles.saveScheduleText}
                        >
                          Save Schedule
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                {/* SENSOR DATA */}
                <View style={styles.sensorRow}>
                  <View style={styles.sensorCard}>
                    <Text style={styles.sensorLabel}>
                      Soil Moisture
                    </Text>

                    <Text style={styles.sensorValue}>
                      {data?.soil_moisture?.toFixed(1) ??
                        "--"}
                      %
                    </Text>
                  </View>
                  <View style={styles.sensorCard}>
                    <Text style={styles.sensorLabel}>
                      Temperature
                    </Text>

                    <Text style={styles.sensorValue}>
                      {data?.temperature?.toFixed(1) ??
                        "--"}
                      °C
                    </Text>
                  </View>
                  <View style={styles.sensorCard}>
                    <Text style={styles.sensorLabel}>
                      Humidity
                    </Text>

                    <Text style={styles.sensorValue}>
                      {data?.humidity?.toFixed(1) ??
                        "--"}
                      %
                    </Text>
                  </View>
                </View>
                {/* PUMP CONTROL */}
                <View style={styles.manualButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.pumpButton,
                      plant.pump_status &&
                        styles.activePump,
                    ]}
                    onPress={() =>
                      togglePump(plant.id, true)
                    }
                  >
                    <Text style={styles.pumpText}>
                      PUMP ON
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pumpButtonOff}
                    onPress={() =>
                      togglePump(plant.id, false)
                    }
                  >
                    <Text style={styles.pumpText}>
                      PUMP OFF
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "#0B1220",
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    backgroundColor: "#0B1220",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#121A2B",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },

  plantName: {
    color: "#22C55E",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  modeContainer: {
    marginBottom: 15,
  },

  modeTitle: {
    color: "#94A3B8",
    marginBottom: 10,
    fontSize: 13,
  },

  modeButtons: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  modeButton: {
    flex: 1,
    backgroundColor: "#1E293B",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  activeMode: {
    backgroundColor: "#22C55E",
  },

  modeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },

  currentMode: {
    color: "#94A3B8",
    fontSize: 13,
    marginBottom: 10,
  },

  sensorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },

  sensorCard: {
    backgroundColor: "#1E293B",
    padding: 12,
    borderRadius: 12,
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
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },

  manualButtonsRow: {
    flexDirection: "row",
    marginTop: 10,
  },

  pumpButton: {
    flex: 1,
    backgroundColor: "#22C55E",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },

  pumpButtonOff: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  activePump: {
    backgroundColor: "#16A34A",
  },

  pumpText: {
    color: "#0B1220",
    fontWeight: "bold",
  },

  noData: {
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },

  retryButton: {
    marginTop: 20,
    padding: 10,
  },

  scheduleContainer: {
    marginTop: 10,
    backgroundColor: "#1E293B",
    padding: 12,
    borderRadius: 12,
  },

  scheduleLabel: {
    color: "#94A3B8",
    marginBottom: 6,
    marginTop: 8,
    fontSize: 12,
  },

  input: {
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },

  saveScheduleButton: {
    backgroundColor: "#22C55E",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  saveScheduleText: {
    color: "#0B1220",
    fontWeight: "bold",
  },
});