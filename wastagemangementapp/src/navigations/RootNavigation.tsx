import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUp from '../screens/SignUp';
import HomeNavigation from './HomeNavigation';
import { useAuthContext } from '../context/AuhtContext';
import { ActivityIndicator, View } from 'react-native';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  HomeScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  const { user, isAuthChecking } = useAuthContext();

  // ✅ show spinner while checking stored token
  if (isAuthChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        // ✅ logged in — show app
        <Stack.Screen
          name="HomeScreen"
          component={HomeNavigation}
          options={{ headerShown: false }}
        />
      ) : (
        // ✅ not logged in — show auth screens
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;