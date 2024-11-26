import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { UserService } from '../apiService'; // Import the UserService

export default function LoginPage({ navigation }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    
    if (!mobile || !password) {
      Alert.alert('Validation Error', 'Please enter both mobile number and password.');
      return;
    }

    // try {
      // // Fetch all users
      // const response = await UserService.getAllUsers();
      // const users = response.data;

      const url = "https://localhost:7023/api/Users"
        let user = await fetch(url);
        result = await user.json();
        console.warn(result)

      // Validate the entered mobile and password
    //   user.find(
    //     (u) => u.mobile == mobile && u.password == password
    //   );

    //   if (user) {
    //     Alert.alert('Login Successful', `Welcome, ${user.name}!`);
    //     navigation.navigate('Home', { user }); // Navigate to Home and pass the user object
    //   } else {
    //     Alert.alert('Login Failed', 'Invalid mobile number or password.');
    //   }
    // } catch (error) {
    //   Alert.alert('Error', 'Unable to login. Please try again later.');
    //   console.log(error)
    // }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hisaab Kitab</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="numeric"
        value={mobile}
        placeholderTextColor="gray"
        onChangeText={setMobile}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        placeholderTextColor="gray"
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  input: {
    width: '80%',
    color: '#000000',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
  },
});
