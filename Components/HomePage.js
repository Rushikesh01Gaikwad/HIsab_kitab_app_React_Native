import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from './Footer';
import {CustomerService} from '../apiService'; // Import your API service

export default function HomePage() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [businesses, setBusinesses] = useState([
    'Water Plant',
    'Milk',
    'Dairy',
    'Newspaper',
  ]);
  const [newBusiness, setNewBusiness] = useState('');
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredCustomers, setFilteredCustomers] = useState([]); // Filtered customers
  const [loading, setLoading] = useState(false); // State for loading spinner
  const [userID, setUserId] = useState(null);
  const navigation = useNavigation();
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State for selected customer
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const getUserID = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.userID;
      }
    } catch (error) {
      console.warn('Error fetching user data:', error.message);
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      const retrievedUserID = await getUserID();
      if (!retrievedUserID) {
        Alert.alert('Error', 'Unable to retrieve user ID. Please try again.');
        return;
      }
      setUserId(retrievedUserID);
      fetchCustomers();
    })();
  }, []);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await CustomerService.getAllCustomersById(userID);
      const customerData = response.data || [];
      setCustomers(customerData);
      setFilteredCustomers(customerData); // Initialize filtered customers
      
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBusiness = () => {
    if (newBusiness.trim()) {
      setBusinesses([...businesses, newBusiness]);
      setNewBusiness('');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user'); // Clear the stored user data
      navigation.navigate('Login'); // Navigate back to the Login screen
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Filter customers based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCustomers(filtered);
    }
  }, [searchQuery, customers]);

  const handleDeleteCustomer = async () => {
    try {
      setLoading(true);
      await CustomerService.deleteCustomer(selectedCustomer.customerID); // Call delete API
      const updatedCustomers = customers.filter(
        (customer) => customer.id !== selectedCustomer.id
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      fetchCustomers();
      Alert.alert('Success', 'Customer deleted successfully.');
    } catch (error) {
      console.log('Error deleting customer:', error);
      console.log('Error', 'Failed to delete customer.');
    } finally {
      setLoading(false);
      setDeleteModalVisible(false);
    }
  };

  const handleLongPress = (customer) => {
    setSelectedCustomer(customer);
    setDeleteModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.companyName}>Hisab Kitab</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addBusinessButton}>
            <Text style={styles.headerButtonText}>Add Business</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
              renderItem={({item}) => (
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
        <Text style={styles.summaryText}>Total Paid: {}</Text>
        <Text style={styles.summaryText}>Total Received: {}</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholderTextColor="gray"
        placeholder="Search Customer"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Customer List */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={{marginTop: 20}}
        />
      ) : (
        <FlatList
          data={filteredCustomers} // Use filtered customers for display
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.customerItem}
              onPress={() =>
                navigation.navigate('CustomerHomePage', {customer: item})}
                onLongPress={() => handleLongPress(item)}>
              <Text style={styles.customerText}>{item.name}</Text>{' '}
              {/* Adjust key as per API */}
            </TouchableOpacity>
          )}
        />
      )}

<Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this customer?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeleteCustomer}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#007bff',
  },
  companyName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
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
    borderRadius: 5,
    marginRight: 10,
  },
  headerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
