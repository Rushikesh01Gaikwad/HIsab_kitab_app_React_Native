import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Footer({ navigation, activeTab }) {
  return (
    <View style={styles.footer}>
      {/* Home Tab */}
      <TouchableOpacity
        style={[
          styles.footerTab,
          activeTab === 'Home' && styles.activeTab,
        ]}
        onPress={() => navigation.navigate('Home')}
      >
        {/* <Icon name="home" size={24} color={activeTab === 'Home' ? '#fff' : '#007bff'} /> */}
        <Text style={[styles.footerTabText, activeTab === 'Home' && styles.activeText]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Add Customer Tab */}
      <TouchableOpacity
        style={[
          styles.footerTab,
          activeTab === 'AddCustomer' && styles.activeTab,
        ]}
        onPress={() => navigation.navigate('AddCustomer')}
      >
        {/* <Icon name="person-add" size={24} color={activeTab === 'AddCustomer' ? '#fff' : '#007bff'} /> */}
        <Text style={[styles.footerTabText, activeTab === 'AddCustomer' && styles.activeText]}>
          Add Customer
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  footerTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerTabText: {
    fontSize: 16,
    color: '#007bff',
  },
  activeTab: {
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  activeText: {
    color: '#fff',
  },
});
