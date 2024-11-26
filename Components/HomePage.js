import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import Footer from './Footer';

export default function HomePage() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [businesses, setBusinesses] = useState([
    'Water Plant',
    'Milk',
    'Dairy',
    'Newspaper',
  ]);
  const [newBusiness, setNewBusiness] = useState('');
  const [customers, setCustomers] = useState([
    'John Doe',
    'Jane Smith',
    'Robert Brown',
  ]);

  const navigation = useNavigation();

  const handleAddBusiness = () => {
    if (newBusiness.trim()) {
      setBusinesses([...businesses, newBusiness]);
      setNewBusiness('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {/* Company Name on the Left */}
        <Text style={styles.companyName}>Hisab Kitab</Text>

        {/* Add Business and Add Staff Buttons on the Right */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addBusinessButton}>
            <Text style={styles.headerButtonText}>Add Business</Text>
            {/* <Icon name="arrow-drop-down" size={20} color="#fff" /> */}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addStaffButton}
            onPress={() => navigation.navigate('Register')}>
            <Text style={styles.headerButtonText}>Add Staff</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Business Modal */}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={businesses}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.businessItem}>{item}</Text>
              )}
            />
            <View style={styles.addBusinessRow}>
              <TextInput
                style={styles.input}
                placeholder="Add new business"
                value={newBusiness}
                onChangeText={setNewBusiness}
              />
              <TouchableOpacity onPress={handleAddBusiness}>
                <Icon name="add" size={30} color="#007bff" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Total Amount Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>Total Received: ₹5000</Text>
        <Text style={styles.summaryText}>Total To Receive: ₹2000</Text>
      </View>

      {/* Search Bar */}
      <TextInput style={styles.searchBar} placeholderTextColor='gray' placeholder="Search Customer" />

      {/* Customer List */}
      <FlatList
        data={customers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.customerItem}>
            <Text style={styles.customerText}>{item}</Text>
          </View>
        )}
      />

      {/* Footer Component */}
      <Footer navigation={navigation} activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This ensures the elements are spaced between
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  companyName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBusinessButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  addStaffButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  summarySection: {
    padding: 20,
    backgroundColor: '#fff',
    marginVertical: 10,
    borderRadius: 10,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    marginVertical: 5,
  },
  searchBar: {
    margin: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  customerItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    elevation: 1,
  },
  customerText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  businessItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addBusinessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
