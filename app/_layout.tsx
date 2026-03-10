import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { View, StyleSheet, useWindowDimensions, Platform } from "react-native";

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <View style={styles.background}>
      <StatusBar style="light" />
      <View style={[styles.container, isLargeScreen && styles.containerLarge]}>
        <Stack initialRouteName="auth/login" screenOptions={{ headerStyle: { backgroundColor: "#0B1220" }, headerTintColor: "#22C55E", headerShown: false, }}>
          <Stack.Screen name="auth/login" options={{headerTitle: "Login Page"}}/>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="dropdown/activity-history"/>
          <Stack.Screen name="dropdown/water-history"/>
          <Stack.Screen name="dropdown/settings"/>
        </Stack>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#050A10',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#0B1220',
  },
  containerLarge: {
    maxWidth: 600,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#1E293B',
  }
});
