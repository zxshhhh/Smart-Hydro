import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";

interface Props {
  moisture: number;
  temperature: number;
  humidity: number;
  onApply?: () => void;
}

export default function AIInsightCard({
  moisture,
  temperature,
  humidity,
  onApply,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [confidence, setConfidence] = useState(92);

  const toggleExpand = () => {
    LayoutAnimation.easeInEaseOut();
    setExpanded(!expanded);
  };

  const refreshInsight = () => {
    // Simulate recalculation
    const randomConfidence = Math.floor(85 + Math.random() * 10);
    setConfidence(randomConfidence);
  };

  const generateInsight = () => {
    if (moisture < 35) {
      return {
        message: "Soil moisture is critically low. Immediate watering recommended.",
        level: "High",
        color: "#EF4444",
        action: "Start watering now",
      };
    }

    if (temperature > 32) {
      return {
        message: "High temperature detected. Increase watering frequency.",
        level: "Medium",
        color: "#F59E0B",
        action: "Adjust auto schedule",
      };
    }

    if (humidity < 40) {
      return {
        message: "Low air humidity may increase evaporation rate.",
        level: "Medium",
        color: "#F59E0B",
        action: "Monitor humidity",
      };
    }

    return {
      message: "Environment conditions are stable. No action needed.",
      level: "Low",
      color: "#22C55E",
      action: "No action required",
    };
  };

  const insight = generateInsight();

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={toggleExpand}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>🤖 AI Smart Insight</Text>
          <View style={[styles.badge, { backgroundColor: insight.color }]}>
            <Text style={styles.badgeText}>{insight.level} Risk</Text>
          </View>
        </View>

        <Text style={styles.message}>{insight.message}</Text>

        {expanded && (
          <>
            <View style={styles.divider} />

            <Text style={styles.detailTitle}>Recommended Action:</Text>
            <Text style={styles.detailText}>{insight.action}</Text>

            <Text style={styles.confidence}>
              Confidence: {confidence}%
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={refreshInsight}
              >
                <Text style={styles.refreshText}>🔄 Recalculate</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: insight.color }]}
                onPress={onApply}
              >
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#121A2B",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#22C55E",
    fontSize: 16,
    fontWeight: "bold",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: {
    color: "#0B1220",
    fontSize: 10,
    fontWeight: "bold",
  },
  message: {
    color: "#94A3B8",
    marginTop: 10,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#1F2937",
    marginVertical: 15,
  },
  detailTitle: {
    color: "#22C55E",
    fontWeight: "bold",
  },
  detailText: {
    color: "#CBD5E1",
    marginBottom: 10,
  },
  confidence: {
    color: "#64748B",
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  refreshButton: {
    backgroundColor: "#1F2937",
    padding: 10,
    borderRadius: 10,
  },
  refreshText: {
    color: "#94A3B8",
  },
  applyButton: {
    padding: 10,
    borderRadius: 10,
  },
  applyText: {
    color: "#0B1220",
    fontWeight: "bold",
  },
});