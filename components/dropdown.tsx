import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';

const DropdownComponent = () => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const toggleMenu = () => setMenuVisible(!isMenuVisible);

  const handleOptionPress = (option: any) => {
    console.log(`Selected: ${option}`);
    setMenuVisible(false);
    if (option === "Activity History") {
      router.push("/dropdown/activity-history");
    }
      else if (option === "Settings") {
        router.push("/dropdown/settings");
      }
      else if (option === "Water History") {
        router.push("/dropdown/water-history");
      }
      else if (option === "Logout") {
        router.push("/auth/login");
      }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
        <AntDesign name="down-circle" size={24} color="#22C55E" />
      </TouchableOpacity>
      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <Pressable style={styles.modalOverlay} onPress={toggleMenu}>
          <View style={styles.menuContainer}>
            {['Activity History', 'Water History', 'Settings', 'Logout'].map((option) => (
              <Pressable
                key={option}
                style={styles.menuItem}
                onPress={() => handleOptionPress(option)}
              >
                <Text style={styles.menuItemText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  iconButton: {
    marginRight: 15, // Align with typical header right padding
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start', // Align to top
    alignItems: 'flex-end', // Align to right
    paddingTop: 50, // Adjust this based on your header height and status bar
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: '#0B1220',
    borderRadius: 5,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 150, // Set a fixed width
  },
  menuItem: {
    padding: 15,
  },
  menuItemText: {
    color: '#22C55E',
    fontSize: 16,
  },
});
