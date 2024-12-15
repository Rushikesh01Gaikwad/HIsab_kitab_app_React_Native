import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { CustomerService } from '../apiService'; // Update the path accordingly
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CustomerHomePage({ route, navigation }) {
  const [isDiscountPercentage, setIsDiscountPercentage] = useState(true);
  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');
  const { customerName, customerPhone } = route.params || {};
    const [userID, setUserId] = useState(null);

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

  const calculateTotal = () => {
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
      Alert.alert('Validation Error', 'Please enter a valid rate greater than 0.');
      return;
    }
  
    if (isNaN(quantityNum) || quantityNum <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid quantity greater than 0.');
      return;
    }
  
    const discountInRs = isDiscountPercentage ? 0 : isNaN(discountNum) ? 0 : discountNum;
    const discountInPer = isDiscountPercentage ? isNaN(discountNum) ? 0 : discountNum : 0;
  
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
    const customerData = {
      name: customerName,
      mobile: customerPhone,
      rate: rateNum,
      quantity: quantityNum,
      discountInRs,
      discountInPer,
      description,
      total: parseFloat(total),
      userID: retrievedUserID,
    };
  
    try {
      // Make the POST request to create the customer
      const response = await CustomerService.createCustomer(customerData);
      Alert.alert('Success', 'Customer details added successfully!', [
        { text: 'OK', onPress: () =>  navigation.navigate('Home') },
      ]);
    } catch (error) {
      console.error('Error creating customer:', error);
      Alert.alert('Error', 'Failed to add customer details. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ₹{calculateTotal()}</Text>
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
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.gotButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
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
});
