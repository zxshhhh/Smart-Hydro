import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import IoIcons from '@expo/vector-icons/Ionicons';
import DropdownComponent from '../../components/dropdown';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerTitle: "Smart Hydro",
        headerStyle: { backgroundColor: "#0B1220"},
        headerTintColor: "#22C55E",
        headerRight: () => (
          <DropdownComponent />
        ),
        tabBarStyle: {
          backgroundColor: "#0B1220",
        },
        tabBarActiveTintColor: "#22C55E",
        tabBarInactiveTintColor: "#94A3B8",
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plant-health"
        options={{
          title: 'Plant Health',
          tabBarIcon: ({ color, size }) => (
            <IoIcons name="leaf" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: 'Notification',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="notifications" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
