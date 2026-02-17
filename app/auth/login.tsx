import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router';

const router = useRouter();

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B1220" }}>
      <View style={styles.container}>
      <Text style={styles.logo}>🌱 Smart Hydro</Text>
      <Text style={styles.subtitle}>
        AI-Powered Autonomous Plant Watering System
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/dashboard")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.footer}>Smart Watering • Smart Living</Text>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0B1220",
    justifyContent: "center",
    padding: 30,
    flex: 1,
  },
  logo: {
    color: "#22C55E",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#121A2B",
    padding: 15,
    borderRadius: 12,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#22C55E",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#0B1220",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 40,
    textAlign: "center",
    color: "#64748B",
  },
})