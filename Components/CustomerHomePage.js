import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import {CustomerService} from '../apiService'; // Update the path accordingly
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function CustomerHomePage({route, navigation}) {
  const {customer} = route.params;
  const {customerName, customerPhone} = route.params || {};

  const [isDiscountPercentage, setIsDiscountPercentage] = useState(true);
  const [rate, setRate] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [quantity, setQuantity] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const [userID, setUserId] = useState(null);
  const [customerID, setCustomerID] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility
  const [receivedAmount, setReceivedAmount] = useState(0);


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
    if (customer) {
      // Prepopulate input fields with customer data for editing
      setName(customer?.name || '');
      setMobile(customer?.mobile || '');
      setRate(customer.rate?.toString() || '');
      setQuantity(customer.quantity?.toString() || '');
      setDiscount(
        (customer.discountInPer || customer.discountInRs)?.toString() || '',
      );
      setDescription(customer.description || '');
      setReceivedAmount(customer.receivedAmt || 0);
      setCustomerID(customer.customerID || null);
      setIsDiscountPercentage(customer.discountInPer > 0);
    }
    console.log('Customer:', customer);
  }, [customer]);

  const calculateTotal = () => {
    // const rateNum = parseFloat(rate) || 0;
    // const quantityNum = parseFloat(quantity) || 0;
    // const discountNum = parseFloat(discount) || 0;
  
    // let total = rateNum * quantityNum;
  
    // if (isDiscountPercentage) {
    //   total -= (total * discountNum) / 100;
    // } else {
    //   total -= discountNum;
    // }
  
    // // Subtract receivedAmount from the total
    // total -= receivedAmount;
  
    // return total > 0 ? total.toFixed(2) : '0.00';
    const rateNum = parseFloat(rate) || 0;
    const quantityNum = parseFloat(quantity) || 0;
    const discountNum = parseFloat(discount) || 0;

    let total = rateNum * quantityNum;

    if (isDiscountPercentage) {
      total -= (total * discountNum) / 100;
    } else {
      total -= discountNum;
    }

    return total > 0 ? total.toFixed(2) : '0.00';
  };
  
  

  const handleSubmit = async () => {
    // Parse and validate inputs
    const rateNum = parseFloat(rate);
    const quantityNum = parseFloat(quantity);
    const discountNum = parseFloat(discount);

    if (isNaN(rateNum) || rateNum <= 0) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid rate greater than 0.',
      );
      return;
    }

    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid quantity greater than 0.',
      );
      return;
    }

    const discountInRs = isDiscountPercentage
      ? 0
      : isNaN(discountNum)
      ? 0
      : discountNum;
    const discountInPer = isDiscountPercentage
      ? isNaN(discountNum)
        ? 0
        : discountNum
      : 0;

    // Calculate the total based on validated inputs
    const total = calculateTotal();

    // Retrieve the user ID from AsyncStorage
    const retrievedUserID = await getUserID();
    if (!retrievedUserID) {
      Alert.alert('Error', 'Unable to retrieve user ID. Please try again.');
      return;
    }
    setUserId(retrievedUserID);

    // Create the customer data object
    const customerDataInsert = {
      name: customerName,
      mobile: customerPhone,
      rate: rateNum,
      quantity: quantityNum,
      discountInRs,
      discountInPer,
      description,
      receivedAmt: receivedAmount || 0,
      total: parseFloat(total),
      userID: retrievedUserID,
    };
    const customerDataUpdate = {
      name: name,
      mobile: mobile,
      rate: rateNum,
      quantity: quantityNum,
      discountInRs,
      discountInPer,
      description,
      customerID,
      receivedAmt: receivedAmount || 0,
      total: parseFloat(total),
      userID: retrievedUserID,
    };

    try {
      if (customerID) {
        // // Call the editCustomer API for updating existing data
        await CustomerService.editCustomer(customerID, customerDataUpdate);
        Alert.alert('Success', 'Customer details updated successfully!', [
          {text: 'OK', onPress: () => navigation.navigate('Home')},
        ]);
      } else {
        // Call the createCustomer API for new data
        await CustomerService.createCustomer(customerDataInsert);
        Alert.alert('Success', 'Customer details added successfully!', [
          {text: 'OK', onPress: () => navigation.navigate('Home')},
        ]);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      Alert.alert(
        'Error',
        'Failed to save customer details. Please try again.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.recAmtContainer}>
      <Text style={styles.recAmtText}>Received: ₹{receivedAmount}</Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Bill: ₹{calculateTotal()}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Rate"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={rate}
          onChangeText={setRate}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Quantity"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
        <View style={styles.discountContainer}>
          <Text style={styles.label}>
            Discount ({isDiscountPercentage ? '%' : '₹'}):
          </Text>
          <TextInput
            style={[styles.input, styles.discountInput]}
            placeholder={`Discount ${
              isDiscountPercentage ? 'Percentage' : 'Rupees'
            }`}
            keyboardType="numeric"
            placeholderTextColor="gray"
            value={discount}
            onChangeText={setDiscount}
          />
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>₹</Text>
            <Switch
              value={isDiscountPercentage}
              onValueChange={setIsDiscountPercentage}
            />
            <Text style={styles.toggleLabel}>%</Text>
          </View>
        </View>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter Description"
          placeholderTextColor="gray"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.sentButton]}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.gotButton]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Got</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalLabel}>Enter recieved amount:</Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="numeric"
              placeholder="Enter value"
              placeholderTextColor="gray"
              value={receivedAmount}
              onChangeText={setReceivedAmount}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false); // Close the modal
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.sendButton]}
                onPress={handleSubmit}>
                <Text style={styles.buttonText}>Send</Text>
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
    backgroundColor: '#f0f8ff',
  },
  recAmtContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  recAmtText: {fontSize: 18, fontWeight: 'bold', color: '#28a745'},
  totalContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  input: {
    width: '90%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  discountInput: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sentButton: {
    backgroundColor: '#dc3545',
  },
  gotButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalLabel: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {backgroundColor: '#6c757d'},
  sendButton: {backgroundColor: '#28a745'},
});
