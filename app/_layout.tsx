import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack initialRouteName="auth/login" screenOptions={{ headerStyle: { backgroundColor: "#0B1220" }, headerTintColor: "#22C55E", headerShown: false, }}>
        <Stack.Screen name="auth/login" options={{headerTitle: "Login Page"}}/>
        <Stack.Screen name="(tabs)"/>
        <Stack.Screen name="dropdown/activity-history"/>
        <Stack.Screen name="dropdown/water-history"/>
        <Stack.Screen name="dropdown/settings"/>
      </Stack>
    </>
  )
}
