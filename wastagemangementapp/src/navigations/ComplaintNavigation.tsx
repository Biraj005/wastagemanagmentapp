import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import HistoryScreen from '../screens/HistoryScreen';
import Complaint from '../screens/Complaint';

export interface ComplaintNavigatinList {
    history: undefined;
    complaint: { id: string };
}
const Stack = createStackNavigator();

const ComplaintNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="history" component={HistoryScreen} />
      <Stack.Screen name="complaint" component={() => <Complaint id="1" />} />
    </Stack.Navigator>
  )
}

export default ComplaintNavigation
