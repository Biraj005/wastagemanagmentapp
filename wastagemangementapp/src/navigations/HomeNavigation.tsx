import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AddComplaintScreen from '../screens/AddComplaintScreen';
import ComplaintNavigation from './ComplaintNavigation';


export type HomeTabParamList = {
  home: undefined;
  history: undefined;
  profile: undefined;
  addcomplaint: undefined;
};
const Tab = createBottomTabNavigator<HomeTabParamList>();

const HomeNavigation = () => {



  return (
    <Tab.Navigator screenOptions={{ headerShown: false,tabBarHideOnKeyboard: true,  }} >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              color={focused ? '#1F7A38' : '#888'}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="history"
        component={ComplaintNavigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="history"
              color={focused ? '#1F7A38' : '#888'}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="addcomplaint"
        component={AddComplaintScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign    
              name="pluscircle"
              color={focused ? '#1F7A38' : '#888'}
              size={24}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="user"
              color={focused ? '#1F7A38' : '#888'}
              size={24}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeNavigation;
