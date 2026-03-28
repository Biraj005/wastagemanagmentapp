import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Navbar = ({ name }: { name: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Hi,<Text style={styles.name}>{name}</Text>
      </Text>
      <View style={styles.nameIcon}>
        <Text style={styles.nameText}>{name.charAt(0).toUpperCase()}</Text>{' '}
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    color: '#27AE60',
    fontWeight: 'bold',
    fontSize: 35,
  },
  text: {
    fontWeight: '600',
    fontSize: 35,
  },
  nameIcon: {
    backgroundColor: '#2ECC71',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  nameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
});
