import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
  value: number;
  unit: string;
  icon: string;
  min?: number;
  max?: number;
};

export default function SensorStatusCard({
  title,
  value,
  unit,
  icon,
  min = 30,
  max = 70,
}: Props) {
  const getStatus = () => {
    if (value < min) return "Low";
    if (value > max) return "High";
    return "Normal";
  };

  const getStatusColor = () => {
    if (value < min) return "#EF4444"; // red
    if (value > max) return "#F59E0B"; // yellow
    return "#22C55E"; // green
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>

      <Text style={styles.value}>
        {value}
        <Text style={styles.unit}> {unit}</Text>
      </Text>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: getStatusColor() },
          ]}
        />
        <Text
          style={[
            styles.statusText,
            { color: getStatusColor() },
          ]}
        >
          {getStatus()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#121A2B",
    padding: 18,
    borderRadius: 20,
    width: "48%",
    marginBottom: 15,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  icon: {
    fontSize: 18,
    marginRight: 8,
  },

  title: {
    color: "#94A3B8",
    fontSize: 13,
  },

  value: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
  },

  unit: {
    fontSize: 14,
    color: "#64748B",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
