import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBaseUrl } from "../../services/api";

interface Plant {
  id: number;
  name: string;
}

interface UserProfile {
  username: string;
}

export default function ProfilePage() {

  const BASE_URL = getBaseUrl();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [plantName, setPlantName] = useState("");

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem(
        "access_token"
      );

      const res = await fetch(
        `${BASE_URL}/api/v1/users/me/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data);
      }
    } catch (err) {
      console.log("Profile fetch error", err);
    }
  };

  const fetchPlants = async () => {
    try {
      const token = await AsyncStorage.getItem(
        "access_token"
      );

      const res = await fetch(
        `${BASE_URL}/api/v1/plants/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPlants(
          Array.isArray(data)
            ? data
            : data.results || []
        );
      }
    } catch (err) {
      console.log("Plant fetch error", err);
    }
  };

  const loadData = async () => {
    setLoading(true);

    await Promise.all([fetchUser(), fetchPlants()]);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(fetchPlants, 1000);
    return () => clearInterval(interval);
  }, []);

  const createPlant = async () => {
    if (!plantName.trim()) {
      Alert.alert("Error", "Plant name is required");
      return;
    }

    try {
      const token = await AsyncStorage.getItem(
        "access_token"
      );

      const res = await fetch(
        `${BASE_URL}/api/v1/plants/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: plantName,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create plant");
      }

      setPlantName("");
      setModalVisible(false);

      fetchPlants();
    } catch (err) {
      Alert.alert("Error", "Failed to create plant");
    }
  };

  const updatePlant = async () => {
    if (!editingPlant) return;

    try {
      const token = await AsyncStorage.getItem(
        "access_token"
      );

      const res = await fetch(
        `${BASE_URL}/api/v1/plants/${editingPlant.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: plantName,
          }),
        }
      );

      const data = await res.json();
      console.log("UPDATE RESPONSE:", data);

      if (!res.ok) {
        throw new Error("Update failed");
      }

      setEditingPlant(null);
      setPlantName("");
      setModalVisible(false);

      fetchPlants();
    } catch (err) {
      Alert.alert("Error", "Failed to update plant");
    }
  };

  /* ================= DELETE PLANT ================= */

  const deletePlant = async (plantId: number) => {
    Alert.alert(
      "Delete Plant",
      "Are you sure you want to delete this plant?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem(
                "access_token"
              );

              const res = await fetch(
                `${BASE_URL}/api/v1/plants/${plantId}/`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (!res.ok) {
                throw new Error("Delete failed");
              }

              fetchPlants();
            } catch (err) {
              Alert.alert(
                "Error",
                "Failed to delete plant"
              );
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingPlant(null);
    setPlantName("");
    setModalVisible(true);
  };

  const openEditModal = (plant: Plant) => {
    setEditingPlant(plant);
    setPlantName(plant.name);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#22C55E"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  const firstLetter =
    user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <View style={styles.container}>
      {/* PROFILE HEADER */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {firstLetter}
          </Text>
        </View>

        <Text style={styles.username}>
          {user?.username}
        </Text>

        <Text style={styles.subtitle}>
          Smart Hydro User
        </Text>
      </View>

      {/* HEADER */}
      <View style={styles.plantHeader}>
        <Text style={styles.sectionTitle}>
          My Plants
        </Text>

        <TouchableOpacity
          style={styles.addButton}
          onPress={openCreateModal}
        >
          <Text style={styles.addButtonText}>
            + Add Plant
          </Text>
        </TouchableOpacity>
      </View>

      {/* PLANT LIST */}
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        renderItem={({ item }) => (
          <View style={styles.plantCard}>
            <View>
              <Text style={styles.plantName}>
                {item.name}
              </Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => openEditModal(item)}
              >
                <Text style={styles.editText}>
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deletePlant(item.id)}
              >
                <Text style={styles.deleteText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editingPlant
                ? "Edit Plant"
                : "Create Plant"}
            </Text>

            <TextInput
              placeholder="Plant name"
              placeholderTextColor="#64748B"
              value={plantName}
              onChangeText={setPlantName}
              style={styles.input}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() =>
                  setModalVisible(false)
                }
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={
                  editingPlant
                    ? updatePlant
                    : createPlant
                }
              >
                <Text style={styles.saveText}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
    padding: 20,
  },

  center: {
    flex: 1,
    backgroundColor: "#0B1220",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#94A3B8",
    marginTop: 10,
  },

  profileCard: {
    backgroundColor: "#121A2B",
    padding: 25,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 25,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  avatarText: {
    color: "#0B1220",
    fontSize: 32,
    fontWeight: "bold",
  },

  username: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94A3B8",
    marginTop: 5,
  },

  plantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  addButton: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
  },

  addButtonText: {
    color: "#0B1220",
    fontWeight: "bold",
  },

  plantCard: {
    backgroundColor: "#121A2B",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  plantName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    gap: 16,
  },

  editText: {
    color: "#38BDF8",
    fontWeight: "600",
  },

  deleteText: {
    color: "#EF4444",
    fontWeight: "600",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modal: {
    width: "100%",
    backgroundColor: "#121A2B",
    borderRadius: 24,
    padding: 20,
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    backgroundColor: "#1E293B",
    color: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  cancelText: {
    color: "#94A3B8",
  },

  saveButton: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  saveText: {
    color: "#0B1220",
    fontWeight: "bold",
  },
});