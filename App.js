import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './Components/LoginPage';
import RegisterPage from './Components/RegisterPage';
import HomePage from './Components/HomePage';
import AddCustomerPage from './Components/AddCustomerPage'
import NewCustomerPage from './Components/NewCustomerPage';
import CustomerHomePage from './Components/CustomerHomePage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
        <Stack.Screen name="AddCustomer" component={AddCustomerPage} options={{ headerShown: false }} />
        <Stack.Screen name="NewCustomerPage" component={NewCustomerPage} />
        <Stack.Screen name="CustomerHomePage" component={CustomerHomePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
