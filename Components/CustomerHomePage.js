import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';

export default function CustomerHomePage({ navigation }) {
  const [isDiscountPercentage, setIsDiscountPercentage] = useState(true); // Toggle state
  const [rate, setRate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [discount, setDiscount] = useState('');
  const [description, setDescription] = useState('');

  // Calculate the total amount
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

  return (
    <View style={styles.container}>
      {/* Total Display */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ₹{calculateTotal()}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Input for Rate */}
        <TextInput
          style={styles.input}
          placeholder="Enter Rate"
          placeholderTextColor='gray'
          keyboardType="numeric"
          value={rate}
          onChangeText={setRate}
        />

        {/* Input for Quantity */}
        <TextInput
          style={styles.input}
          placeholder="Enter Quantity"
          placeholderTextColor='gray'
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        {/* Discount Input and Toggle */}
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
            placeholderTextColor='gray'
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

        {/* Input for Description */}
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Enter Description"
          placeholderTextColor='gray'
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, styles.sentButton]}
          onPress={() => {
            console.log('Add Button Pressed');
          }}
        >
          <Text style={styles.buttonText}>Sent</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, styles.gotButton]}
          onPress={() => {
            console.log('Cancel Button Pressed');
          }}
        >
          <Text style={styles.buttonText}>Got</Text>
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
    marginTop: 50, // To avoid overlap with total display
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
  button: {
    width: '80%',
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
});
