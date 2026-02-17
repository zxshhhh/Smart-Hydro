import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function ActivityHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const [activities, setActivities] = useState([
    {
      id: "1",
      type: "manual",
      title: "Manual Watering",
      description: "Pump turned ON manually.",
      waterUsed: "2.1L",
      time: "Today • 10:45 AM",
      dateGroup: "Today",
    },
    {
      id: "2",
      type: "automatic",
      title: "Automatic Irrigation",
      description: "Moisture dropped below 35%. AI triggered watering.",
      waterUsed: "1.4L",
      time: "Today • 09:12 AM",
      dateGroup: "Today",
    },
    {
      id: "3",
      type: "schedule",
      title: "Scheduled Watering",
      description: "Morning watering routine executed.",
      waterUsed: "3.0L",
      time: "Yesterday • 6:00 PM",
      dateGroup: "Yesterday",
    },
    {
      id: "4",
      type: "alert",
      title: "Low Moisture Alert",
      description: "Aloe Vera moisture reached 28%.",
      waterUsed: "-",
      time: "Yesterday • 3:15 PM",
      dateGroup: "Yesterday",
    },
  ]);

  const filters = ["all", "manual", "automatic", "schedule", "alert"];

  const filteredActivities = useMemo(() => {
    if (selectedFilter === "all") return activities;
    return activities.filter(a => a.type === selectedFilter);
  }, [selectedFilter, activities]);

  const getColor = (type: string) => {
    switch (type) {
      case "manual": return "#38BDF8";
      case "automatic": return "#22C55E";
      case "schedule": return "#A855F7";
      case "alert": return "#EF4444";
      default: return "#64748B";
    }
  };

  const totalWater = activities
    .filter(a => a.waterUsed !== "-")
    .reduce((sum, item) => sum + parseFloat(item.waterUsed), 0)
    .toFixed(1);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Activity History</Text>

      {/* SUMMARY SECTION */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{activities.length}</Text>
          <Text style={styles.summaryLabel}>Total Events</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalWater}L</Text>
          <Text style={styles.summaryLabel}>Water Used</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>87%</Text>
          <Text style={styles.summaryLabel}>Conservation</Text>
        </View>
      </View>

      {/* FILTER TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 15 }}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && { color: "#000" },
              ]}
            >
              {filter.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ACTIVITY LIST */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {filteredActivities.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 40 }}>🌱</Text>
            <Text style={styles.emptyText}>
              No activity found
            </Text>
          </View>
        ) : (
          filteredActivities.map(item => (
            <View key={item.id} style={styles.card}>
              <View
                style={[
                  styles.sideBar,
                  { backgroundColor: getColor(item.type) },
                ]}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {item.title}
                </Text>

                <Text style={styles.description}>
                  {item.description}
                </Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    💧 {item.waterUsed}
                  </Text>
                  <Text style={styles.metaText}>
                    🕒 {item.time}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* CLEAR BUTTON */}
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => setActivities([])}
      >
        <Text style={styles.clearText}>Clear History</Text>
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
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },

  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#121A2B",
    padding: 18,
    borderRadius: 20,
    marginTop: 20,
  },

  summaryItem: {
    alignItems: "center",
  },

  summaryValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  summaryLabel: {
    color: "#64748B",
    fontSize: 12,
  },

  filterButton: {
    height: 32,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#1E293B",
    borderRadius: 20,
    marginRight: 10,
  },

  activeFilter: {
    backgroundColor: "#22C55E",
  },

  filterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#121A2B",
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
  },

  sideBar: {
    width: 6,
    borderRadius: 5,
    marginRight: 12,
  },

  title: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 5,
  },

  description: {
    color: "#94A3B8",
    marginBottom: 8,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  metaText: {
    color: "#64748B",
    fontSize: 12,
  },

  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyText: {
    color: "#64748B",
    marginTop: 10,
  },

  clearButton: {
    backgroundColor: "#1E293B",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 15,
  },

  clearText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
