import { Tabs } from 'expo-router';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import IoIcons from '@expo/vector-icons/Ionicons';
import DropdownComponent from '../../components/dropdown';
import Feather from '@expo/vector-icons/Feather';

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
        name="waterNow"
        options={{
          title: 'Water Now',
          tabBarIcon: ({ color, size }) => (
            <IoIcons name="leaf" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
