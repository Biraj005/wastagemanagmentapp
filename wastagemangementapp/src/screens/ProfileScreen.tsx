import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshControl } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Role, UserResponse } from '../types/User';
import Header from '../components/Header';
import { useAuthContext } from '../context/AuhtContext';
import Loading from '../components/Loading';
import { useFocusEffect } from '@react-navigation/native';
import { CommonActions, useNavigation } from '@react-navigation/native';

export interface IUser extends UserResponse {}

export default function ProfileScreen() {
  const { loading, user, getUserFromStorage,setUser } = useAuthContext();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await getUserFromStorage();
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      if (!user) {
        getUserFromStorage();
      }
    }, [user]),
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setUser(null)
    } catch (error) {
      console.log('token')
    }
  };
  const isAdmin = user?.role === Role.ADMIN;

  if (loading) {
    return <Loading visible={loading} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0) || 'U'}
            </Text>
          </View>

          <Text style={styles.usernameText}>{user?.username}</Text>
          <Text style={styles.emailText}>{user?.email}</Text>

          <View
            style={[
              styles.roleBadge,
              isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser,
            ]}
          >
            <MaterialCommunityIcons
              name={isAdmin ? 'shield-star-outline' : 'account-outline'}
              size={14}
              color={isAdmin ? '#D09214' : '#1F7A38'}
            />
            <Text style={styles.roleText}>{user?.role.toString()}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Account Details</Text>
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <View style={styles.detailIconWrapper}>
              <Ionicons name="location-outline" size={20} color="#666" />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>District / Region</Text>
              <Text style={styles.detailValue}>{user?.district}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIconWrapper}>
              <Feather name="hash" size={20} color="#666" />
            </View>
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Account ID</Text>
              <Text style={styles.detailValue}>#{user?.id}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <View
                style={[
                  styles.detailIconWrapper,
                  { backgroundColor: '#E8F5E9' },
                ]}
              >
                <Feather name="bell" size={18} color="#1F7A38" />
              </View>
              <Text style={styles.actionText}>Push Notifications</Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: '#E0E0E0', true: '#AEEDB3' }}
              thumbColor={true ? '#1F7A38' : '#f4f3f4'}
            />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <View
                style={[
                  styles.detailIconWrapper,
                  { backgroundColor: '#EBF4FC' },
                ]}
              >
                <Feather name="lock" size={18} color="#3A7CB8" />
              </View>
              <Text style={styles.actionText}>Privacy & Security</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <View
                style={[
                  styles.detailIconWrapper,
                  { backgroundColor: '#F3E5F5' },
                ]}
              >
                <Feather name="help-circle" size={18} color="#8E24AA" />
              </View>
              <Text style={styles.actionText}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleLogout()}
        >
          <Feather name="log-out" size={18} color="#D93025" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>App Version 1.0.4</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#F7F8FC',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  profileHeaderCard: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1F7A38',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
  },
  usernameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  roleBadgeUser: {
    backgroundColor: '#E8F5E9',
  },
  roleBadgeAdmin: {
    backgroundColor: '#FDF1CB',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  roleTextUser: {
    color: '#1F7A38',
  },
  roleTextAdmin: {
    color: '#D09214',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FAD5D5',
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D93025',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#BBB',
    marginBottom: 20,
  },
});
