import { createContext, useContext, useEffect, useState } from 'react';
import { IUser, LoginResponseDto, UserResponse } from '../types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BACKEND_URL } from '../utils/Constant';
import { Alert } from 'react-native';
import { ApiResponse } from '../types/Response';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  isAuthChecking: boolean;       // ✅ initial auth check state
  getUserFromStorage: () => Promise<void>;
  login: (email: string, password: string) => Promise<Boolean>;
  logout: () => Promise<void>;   // ✅ now async
  register: (
    name: string,
    email: string,
    password: string,
    district: string,
  ) => Promise<Boolean>;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = BACKEND_URL;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true); // ✅ true until first check done

  const getUserFromStorage = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      // ✅ fixed: was checking !token twice, now correctly clears on no token
      if (!token) {
        setUser(null);
        return;
      }

      const { data }: { data: ApiResponse<UserResponse> } = await axios.get(
        `${API_URL}/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUser(data.data);
      console.log(data, 'from context');
    } catch (error) {
      // ✅ fixed: was only removing token if !token (wrong logic)
      // now clears token on any auth failure (e.g. expired token)
      console.log('Error retrieving user from storage:', error);
      await AsyncStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
      setIsAuthChecking(false); // ✅ auth check complete
    }
  };

  // ✅ full logout implementation
  const logout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
    district: string,
  ) => {
    try {
      setLoading(true);
      const payload = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        district: district.trim(),
      };
      const { data } = await axios.post(`${API_URL}/auth/signup`, payload);
      setUser(data.data as IUser);
      return true;
    } catch (error: any) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        console.log('FULL ERROR RESPONSE:', error.response?.data);
        Alert.alert(
          'Registration Failed',
          error.response?.data?.message ||
            'Please check all fields and try again',
        );
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setLoading(false);
    }
    return false;
  };

  const loginUser = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await axios.post<ApiResponse<LoginResponseDto>>(
        `${API_URL}/auth/login`,
        { email, password },
      );

      const loginData = response.data;

      if (loginData.success) {
        await AsyncStorage.setItem('token', loginData.data.token);
        await getUserFromStorage(); // ✅ fetch user immediately after login
        return true;
      } else {
        console.log('Login failed:', loginData.message);
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
    return false;
  };

  useEffect(() => {
    getUserFromStorage();
  }, []);

  const value = {
    user,
    loading,
    isAuthChecking,             
    login: loginUser,
    logout,                      
    setUser,
    register: signUp,
    getUserFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};