import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

interface Plant {
  id: string;
  name: string;
  temperature: number;
  moisture: number;
  humidity: number;
  waterUsage: number;
}

export default function PlantHealthPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://192.168.1.13:5000";

  const fetchPlants = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/plants`);
      setPlants(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching plants:", error.message);
    }
  };

  useEffect(() => {
    fetchPlants();

    // Auto refresh every 3 seconds (simulate IoT real-time)
    const interval = setInterval(fetchPlants, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={{ color: "#fff", marginTop: 10 }}>
          Connecting to Smart Hydro...
        </Text>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Plant Health</Text>

      {plants.map((plant) => (
        <View key={plant.id} style={styles.card}>
          <Text style={styles.plantName}>{plant.name}</Text>

          <Text style={styles.plantData}>
            🌡 Temperature: {plant.temperature.toFixed(1)}°C
          </Text>

          <Text style={styles.plantData}>
            💧 Soil Moisture: {plant.moisture.toFixed(1)}%
          </Text>

          <Text style={styles.plantData}>
            💦 Humidity: {plant.humidity.toFixed(1)}%
          </Text>

          <Text style={styles.usage}>
            🚰 Water Used: {plant.waterUsage.toFixed(2)} L
          </Text>
        </View>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    padding: 20,
  },
  header: {
    color: "#22C55E",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#121A2B",
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
  },
  plantName: {
    color: "#22C55E",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  plantData: {
    color: "#94A3B8",
    marginBottom: 5,
  },
  usage: {
    color: "#38BDF8",
    marginTop: 5,
  },
  center: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },
})