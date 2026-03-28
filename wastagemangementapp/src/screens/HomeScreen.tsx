import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';


import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useComplaintContext } from '../context/ComplaintContext';
import ComplaintList from '../components/ComplaintList';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { HomeTabParamList } from '../navigations/HomeNavigation';
import Header from '../components/Header';

type HomeScreenProps = {
  navigation: BottomTabNavigationProp<HomeTabParamList, 'home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { complaints, resolvedPercentage ,refreshComplaints} = useComplaintContext();
  const [refreshing, setRefreshing] = useState(false);
  
    const onRefresh = async () => {
      setRefreshing(true);
      await refreshComplaints();
      setRefreshing(false);
    };
  
    useEffect(()=>{
      async function init() {
        await refreshComplaints();
      }
      init();
    },[])
  const renderHeader = (
    <>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>Keep your city green, one report at a time.</Text>
        <Text style={styles.heroSubtitle}>
          Our atelier-grade reporting tool makes environmental stewardship simple, fast, and impactful.
        </Text>
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.primaryButton} onPress={()=>navigation.navigate('addcomplaint')}>
            <MaterialCommunityIcons name="file-document-outline" size={18} color="#1F7A38" />
            <Text style={styles.primaryButtonText}>Report Waste</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={[styles.statIconWrapper, { backgroundColor: '#E9F7EF' }]}>
            <Feather name="check-circle" size={18} color="#27AE60" />
          </View>
          <Text style={[styles.statBadgeText, { color: '#27AE60' }]}>
            {resolvedPercentage?.toFixed(0) || 0}% Resolved
          </Text>
        </View>
        <Text style={styles.statLabel}>Reports Submitted</Text>
        <Text style={styles.statValue}>{complaints.length}</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Reports</Text>
        <TouchableOpacity onPress={() => navigation.navigate('history')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderFooter = (
    <View style={styles.tipCard}>
      <View style={styles.tipHeader}>
        <Ionicons name="bulb-outline" size={16} color="#1F7A38" />
        <Text style={styles.tipLabel}>SUSTAINABILITY TIP</Text>
      </View>
      <Text style={styles.tipTitle}>The 5-Minute Cleanup</Text>
      <Text style={styles.tipText}>
        Spend 5 minutes each day clearing your immediate sidewalk. It reduces urban heat and prevents drain clogging.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F8FC" />
      <Header />
      <ComplaintList 
        onRefresh={onRefresh}
        refreshing={refreshing}
        complaints={complaints} 
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.scrollContent}
      />
      
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, 
  },
 
  heroCard: {
    backgroundColor: '#267A3B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 12,
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 16,
  },
  primaryButtonText: {
    color: '#1F7A38',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  viewAllText: {
    fontSize: 14,
    color: '#1F7A38',
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#AEEDB3',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F7A38',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
});