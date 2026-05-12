import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser } from '../../services/auth';

export default function LoginScreen() {
  const navigation = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      await loginUser(username, password);
      navigation.replace('/dashboard');   // Change to your main screen name
    } catch (error) {
      Alert.alert('Login Failed', error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0B1220" }}>
      <View style={styles.container}>
        <Text style={styles.logo}>🌱 Smart Hydro</Text>
        <Text style={styles.subtitle}>
          AI-Powered Autonomous Plant Watering System
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Username"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
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
          onPress={handleLogin}
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