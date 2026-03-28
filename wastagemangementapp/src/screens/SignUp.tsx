import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import { useAuthContext } from '../context/AuhtContext';
import { ISignUpError, SignupSchema } from '../types/Error';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigations/RootNavigation';

type NavigationProp = {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
};

const SignUpScreen = ({ navigation }: NavigationProp) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [district, setDistrict] = useState('');

  const [errors, setError] = useState<ISignUpError | null>(null);
  const { register, loading } = useAuthContext();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError({ password: 'Passwords do not match' });
      return;
    }

    const result = SignupSchema.safeParse({ name, email, password, district });

    if (!result.success) {
      const fieldErrors: ISignUpError = {};

      result.error.issues.forEach(err => {
        const fieldName = err.path[0] as keyof ISignUpError;

        if (fieldName) {
          fieldErrors[fieldName] = err.message;
        }
      });

      setError(fieldErrors);
      return;
    }

    const success = await register(name, email, password, district);

    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDistrict('');
    if (success) {
      Alert.alert('Success', 'Registration completed successfully!', [
        { text: 'OK', onPress: () => {} },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <View style={styles.logoContainer}>
              <Icon name="leaf-outline" size={24} color="#1C6E26" />
              <Text style={styles.logoText}>Eco-Reporter</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Please enter your details to create an account.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            {errors?.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
            <View style={styles.inputWrapper}>
              <Icon
                name="person-outline"
                size={24}
                color="#000"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#A0A0A0"
                value={name}
                onChangeText={setName}
              />
            </View>
            <Text style={styles.inputLabel}>Email Address</Text>

            <View style={styles.inputWrapper}>
              <Fontisto
                name="email"
                color="#000"
                size={24}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.passwordHeader}>
              <Text style={styles.inputLabel}>Password</Text>
            </View>
            {errors?.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Icon
                  name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#7A7A7A"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!isPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Icon
                  name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#7A7A7A"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>District</Text>
              {errors?.district && (
                <Text style={styles.errorText}>{errors.district}</Text>
              )}
              <View style={styles.inputWrapper}>
                <Entypo
                  style={styles.inputIcon}
                  name="location"
                  color="#000"
                  size={24}
                />
                <TextInput
                  style={styles.input}
                  placeholder="District"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="default"
                  autoCapitalize="none"
                  value={district}
                  onChangeText={setDistrict}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleSignUp()}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Text>
              <Icon name="arrow-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F3F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C6E26',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: -4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#C0C0C0',
    borderRadius: 6,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#1C6E26',
    borderColor: '#1C6E26',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#555555',
  },
  loginButton: {
    backgroundColor: '#1C6E26',
    flexDirection: 'row',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
    color: '#888888',
    letterSpacing: 1,
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 52,
    borderWidth: 2,
    borderColor: 'Black',
    borderRadius: 26,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 15,
    color: '#555555',
  },
  signUpText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C6E26',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 4,
  },
});

export default SignUpScreen;
