import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function WaterHistoryPage() {
  const [selectedRange, setSelectedRange] = useState("week");

  const summary = {
    today: 4.6,
    week: 28.4,
    month: 112.8,
  };

  const sessions = [
    {
      id: "1",
      plant: "Snake Plant",
      mode: "Automatic",
      amount: "1.4L",
      time: "Today • 9:12 AM",
    },
    {
      id: "2",
      plant: "Aloe Vera",
      mode: "Manual",
      amount: "2.1L",
      time: "Today • 10:45 AM",
    },
    {
      id: "3",
      plant: "Peace Lily",
      mode: "Scheduled",
      amount: "3.0L",
      time: "Yesterday • 6:00 PM",
    },
  ];

  const ranges = ["today", "week", "month"];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Water History</Text>
      {/* RANGE SELECTOR */}
      <View style={styles.rangeContainer}>
        {ranges.map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.rangeButton,
              selectedRange === range && styles.activeRange,
            ]}
            onPress={() => setSelectedRange(range)}
          >
            <Text
              style={[
                styles.rangeText,
                selectedRange === range && { color: "#000" },
              ]}
            >
              {range.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* SUMMARY CARD */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          Total Water Usage
        </Text>
        <Text style={styles.summaryValue}>
          {summary[selectedRange]}L
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.smallValue}>87%</Text>
            <Text style={styles.smallLabel}>
              Conservation
            </Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.smallValue}>+12%</Text>
            <Text style={styles.smallLabel}>
              Efficiency
            </Text>
          </View>
        </View>
      </View>
      {/* DAILY GRAPH PLACEHOLDER */}
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>
          📊 Usage Trend
        </Text>
        <View style={styles.fakeGraph}>
          <Text style={{ color: "#64748B" }}>
            (Chart Placeholder)
          </Text>
        </View>
      </View>
      {/* WATERING SESSIONS */}
      <Text style={styles.sectionTitle}>
        🚿 Recent Watering Sessions
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {sessions.map((item) => (
          <View key={item.id} style={styles.sessionCard}>
            <View>
              <Text style={styles.plantName}>
                {item.plant}
              </Text>
              <Text style={styles.mode}>
                {item.mode}
              </Text>
              <Text style={styles.time}>
                {item.time}
              </Text>
            </View>
            <Text style={styles.amount}>
              {item.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
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
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  rangeContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
  rangeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#1E293B",
    borderRadius: 20,
    marginRight: 10,
  },
  activeRange: {
    backgroundColor: "#22C55E",
  },
  rangeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  summaryCard: {
    backgroundColor: "#121A2B",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    color: "#94A3B8",
  },
  summaryValue: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  summaryBox: {
    alignItems: "center",
  },
  smallValue: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "bold",
  },
  smallLabel: {
    color: "#64748B",
    fontSize: 12,
  },
  graphCard: {
    backgroundColor: "#121A2B",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  graphTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 10,
  },
  fakeGraph: {
    height: 120,
    backgroundColor: "#1E293B",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#22C55E",
    fontWeight: "bold",
    marginBottom: 10,
  },
  sessionCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#121A2B",
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
  },
  plantName: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  mode: {
    color: "#94A3B8",
    fontSize: 12,
  },
  time: {
    color: "#64748B",
    fontSize: 12,
  },
  amount: {
    color: "#38BDF8",
    fontWeight: "bold",
    fontSize: 16,
  },
});
