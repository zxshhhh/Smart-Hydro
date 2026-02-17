import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";

export default function SettingsPage() {
  const [autoMode, setAutoMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [aiInsights, setAiInsights] = useState(true);

  const SettingItem = ({
    icon,
    title,
    description,
    toggle,
    value,
    onValueChange,
  }: any) => (
    <View style={styles.settingCard}>
      <View style={styles.settingLeft}>
        <Text style={styles.icon}>{icon}</Text>
        <View>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </View>
      {toggle ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: "#334155", true: "#22C55E" }}
          thumbColor={"#FFFFFF"}
        />
      ) : (
        <Text style={styles.arrow}>›</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚙ Settings</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* SYSTEM */}
        <Text style={styles.section}>SYSTEM</Text>
        <SettingItem
          icon="🤖"
          title="Automatic Watering"
          description="Allow AI to control irrigation"
          toggle
          value={autoMode}
          onValueChange={setAutoMode}
        />
        <SettingItem
          icon="📡"
          title="Device Status"
          description="Smart Hydro v1.0 • Connected"
        />
        {/* PLANTS */}
        <Text style={styles.section}>PLANTS</Text>
        <SettingItem
          icon="🌱"
          title="Manage Plants"
          description="Add, edit, or remove plants"
        />
        <SettingItem
          icon="📅"
          title="Watering Schedule"
          description="Configure irrigation schedules"
        />
        {/* NOTIFICATIONS */}
        <Text style={styles.section}>NOTIFICATIONS</Text>
        <SettingItem
          icon="🔔"
          title="Push Notifications"
          description="Receive moisture alerts"
          toggle
          value={notifications}
          onValueChange={setNotifications}
        />
        {/* AI SETTINGS */}
        <Text style={styles.section}>AI SETTINGS</Text>

        <SettingItem
          icon="🧠"
          title="AI Smart Insights"
          description="Enable predictive watering"
          toggle
          value={aiInsights}
          onValueChange={setAiInsights}
        />
        {/* WATER TANK */}
        <Text style={styles.section}>WATER SYSTEM</Text>
        <SettingItem
          icon="💧"
          title="Water Tank Capacity"
          description="Current: 20 Liters"
        />
        <SettingItem
          icon="♻"
          title="Reset Water Statistics"
          description="Clear usage history"
        />
        {/* APPEARANCE */}
        <Text style={styles.section}>APPEARANCE</Text>
        <SettingItem
          icon="🌙"
          title="Dark Mode"
          toggle
          value={darkMode}
          onValueChange={setDarkMode}
        />
        {/* SECURITY */}
        <Text style={styles.section}>SECURITY</Text>
        <SettingItem
          icon="🔐"
          title="Change Password"
        />
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
    marginBottom: 20,
  },
  section: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  settingCard: {
    backgroundColor: "#121A2B",
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
    marginRight: 15,
  },
  title: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  description: {
    color: "#64748B",
    fontSize: 12,
  },
  arrow: {
    color: "#64748B",
    fontSize: 20,
  },
});
