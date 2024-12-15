import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StaffService } from '../apiService'; // Import the StaffService
import Footer from './Footer';

export default function AddStaff({ navigation }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const addStaff = async () => {
    // Ensure userID is retrieved before proceeding
    const retrievedUserID = await getUserID();
    if (!retrievedUserID) {
      Alert.alert('Error', 'Unable to retrieve user ID. Please try again.');
      return;
    }
    setUserId(retrievedUserID);

    // Input validation
    if (!name || !mobile || !password) {
      Alert.alert('Validation Error', 'All fields are required!');
      return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
      Alert.alert('Validation Error', 'Enter a valid 10-digit mobile number!');
      return;
    }

    setLoading(true);

    try {
      // Prepare staff data
      const staffData = {
        name,
        mobile,
        password,
        userId: retrievedUserID,
      };

      // API call to add staff
      const response = await StaffService.createStaff(staffData);
      if (response.status === 201) {
        Alert.alert('Success', 'Staff member added successfully!');
        navigation.navigate('Home'); // Navigate back to Home
      } else {
        throw new Error('Failed to add staff. Try again later.');
      }
    } catch (error) {
      console.warn('Add Staff Error:', error.message);
      Alert.alert('Error', 'Something went wrong while adding the staff.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add your staff</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="numeric"
          value={mobile}
          onChangeText={setMobile}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!toggle}
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.toggleContainer}>
          <Text>Show Password</Text>
          <Switch value={toggle} onValueChange={() => setToggle(!toggle)} />
        </View>
        <TouchableOpacity style={styles.button} onPress={addStaff}>
          <Text style={styles.buttonText}>
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
      <Footer navigation={navigation} activeTab="AddStaff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Ensures content and footer are spaced
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
