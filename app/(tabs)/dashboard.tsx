import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBaseUrl } from "../../services/api";

interface Plant {
  id: number;
  name: string;
  pump_status: boolean;
  moisture?: number | null;
  temperature?: number | null;
  humidity?: number | null;
  waterUsage?: number;
}

export default function DashboardPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const BASE_URL = getBaseUrl();

  const fetchPlants = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(`${BASE_URL}/api/v1/plants/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const plantList = Array.isArray(data)
        ? data
        : data.results || [];

      const plantsWithSensors = await Promise.all(
        plantList.map(async (plant: Plant) => {
          try {
            const sensorRes = await fetch(
              `${BASE_URL}/api/v1/plants/${plant.id}/sensor-data/latest/`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!sensorRes.ok) {
              return {
                ...plant,
                moisture: null,
                temperature: null,
                humidity: null,
              };
            }

            const sensorData = await sensorRes.json();

            return {
              ...plant,
              moisture:
                sensorData.soil_moisture ?? null,
              temperature:
                sensorData.temperature ?? null,
              humidity:
                sensorData.humidity ?? null,
            };
          } catch {
            return {
              ...plant,
              moisture: null,
              temperature: null,
              humidity: null,
            };
          }
        })
      );

      setPlants(plantsWithSensors);
    } catch (error: any) {
      console.log(
        "Error fetching plants:",
        error.message
      );

      setPlants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
    const interval = setInterval(fetchPlants, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#22C55E"
        />

        <Text
          style={{
            color: "#fff",
            marginTop: 10,
          }}
        >
          Connecting to Smart Hydro...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.body}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          Dashboard
        </Text>

        <View
          style={
            isLargeScreen
              ? styles.gridContainer
              : undefined
          }
        >
          {plants.map((plant) => (
            <View
              key={plant.id}
              style={[
                styles.card,
                isLargeScreen &&
                  styles.gridCard,
              ]}
            >
              <View style={styles.topRow}>
                <Text style={styles.plantName}>
                  {plant.name}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        plant.pump_status
                          ? "#14532D"
                          : "#3F3F46",
                    },
                  ]}
                >
                  <Text
                    style={styles.statusText}
                  >
                    {plant.pump_status
                      ? "WATERING"
                      : "IDLE"}
                  </Text>
                </View>
              </View>

              <Text style={styles.plantData}>
                🌡 Temperature:{" "}
                {plant.temperature !== null &&
                plant.temperature !== undefined
                  ? `${Number(
                      plant.temperature
                    ).toFixed(1)}°C`
                  : "-- °C"}
              </Text>

              <Text style={styles.plantData}>
                💧 Soil Moisture:{" "}
                {plant.moisture !== null &&
                plant.moisture !== undefined
                  ? `${Number(
                      plant.moisture
                    ).toFixed(1)}%`
                  : "-- %"}
              </Text>

              <Text style={styles.plantData}>
                💦 Humidity:{" "}
                {plant.humidity !== null &&
                plant.humidity !== undefined
                  ? `${Number(
                      plant.humidity
                    ).toFixed(1)}%`
                  : "-- %"}
              </Text>

              <Text style={styles.usage}>
                🚰 Water Used:{" "}
                {plant.waterUsage
                  ? `${plant.waterUsage.toFixed(
                      2
                    )} L`
                  : "0.00 L"}
              </Text>
            </View>
          ))}
        </View>
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
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
  },
  header: {
    color: "#22C55E",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#121A2B",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  plantName: {
    color: "#22C55E",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  plantData: {
    color: "#CBD5E1",
    marginBottom: 8,
    fontSize: 14,
  },
  usage: {
    color: "#38BDF8",
    marginTop: 10,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },
});