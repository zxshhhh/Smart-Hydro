import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "warning",
      title: "Low Soil Moisture",
      message: "Aloe Vera moisture dropped below 35%.",
      time: "2 mins ago",
    },
    {
      id: "2",
      type: "info",
      title: "Automatic Watering Activated",
      message: "System watered Snake Plant for 30 seconds.",
      time: "10 mins ago",
    },
    {
      id: "3",
      type: "success",
      title: "Healthy Condition",
      message: "All plants are in optimal condition.",
      time: "1 hour ago",
    },
    {
      id: "4",
      type: "ai",
      title: "AI Smart Insight",
      message:
        "Water consumption increased 12% today. Consider adjusting schedule.",
      time: "Today • 9:30 AM",
    },
  ]);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "warning":
        return styles.warning;
      case "success":
        return styles.success;
      case "info":
        return styles.info;
      case "ai":
        return styles.ai;
      default:
        return styles.info;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return "⚠";
      case "success":
        return "🟢";
      case "info":
        return "💧";
      case "ai":
        return "🤖";
      default:
        return "🔔";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((item) => (
          <View
            key={item.id}
            style={[styles.card, getTypeStyle(item.type)]}
          >
            <View style={styles.row}>
              <Text style={styles.icon}>
                {getIcon(item.type)}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>
                  {item.message}
                </Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => setNotifications([])}
      >
        <Text style={styles.clearText}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
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
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 5,
  },
  message: {
    color: "#94A3B8",
    marginBottom: 6,
  },
  time: {
    color: "#64748B",
    fontSize: 12,
  },
  warning: {
    borderLeftColor: "#EF4444",
  },
  success: {
    borderLeftColor: "#22C55E",
  },
  info: {
    borderLeftColor: "#38BDF8",
  },
  ai: {
    borderLeftColor: "#A855F7",
  },
  clearButton: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  clearText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
