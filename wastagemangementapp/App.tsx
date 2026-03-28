import { StyleSheet } from 'react-native';
import React from 'react';
import RootNavigation from './src/navigations/RootNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuhtContext';  
import { ComplaintProvider } from './src/context/ComplaintContext';

const App = () => {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <NavigationContainer>
          <RootNavigation />
        </NavigationContainer>
      </ComplaintProvider>
    </AuthProvider>
  );
};

export default App;

const styles = StyleSheet.create({});