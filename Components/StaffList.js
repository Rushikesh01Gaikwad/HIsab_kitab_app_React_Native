import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { StaffService } from "../apiService";

export default function StaffList({ route, navigation }) {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = route?.params; // Get user ID passed from AddStaff
  console.warn(userId)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await StaffService.getStaffByUserId(userId);
        console.log(response)
        if (response?.status === 200) {
          setStaffList(response.data);
        } else {
          Alert.alert("Error", "Failed to fetch staff list.");
        }
      } catch (error) {
       
        // Alert.alert("Error", "Something went wrong while fetching staff.");
        // console.warn("Error fetching staff:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [userId]);

  const renderItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.staffName}>{item.name}</Text>
      <Text style={styles.staffMobile}>{item.mobile}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Staff List...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Staff List</Text>
      {staffList.length > 0 ? (
        <FlatList
          data={staffList}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noDataText}>No staff found.</Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("addStaff")}
      >
        <Text style={styles.addButtonText}>Add Staff</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  staffName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  staffMobile: {
    fontSize: 16,
    color: "#666",
  },
  noDataText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
