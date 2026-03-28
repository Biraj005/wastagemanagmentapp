import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Alert, // <-- Imported FlatList
} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../components/Header';
import { useComplaintContext } from '../context/ComplaintContext';
import { getColor } from '../components/ComplaintList';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ComplaintStatus, IComplaint } from '../types/Complaint';
import { RefreshControl } from 'react-native';

const FILTER_OPTIONS = ['All Reports', 'Completed', 'Pending'];

const getStatusConfig = (status: ComplaintStatus) => {
  switch (status) {
    case ComplaintStatus.COMPLETED:
      return {
        bg: '#AEEDB3',
        color: getColor(ComplaintStatus.COMPLETED),
        label: 'RESOLVED',
      };
    case ComplaintStatus.WORKING:
      return {
        bg: '#FDF1CB',
        color: getColor(ComplaintStatus.WORKING),
        label: 'IN PROGRESS',
      };
    case ComplaintStatus.PENDING:
    default:
      return {
        bg: '#D0E4F5',
        color: getColor(ComplaintStatus.PENDING),
        label: 'PENDING',
      };
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('All Reports');
  const { complaints, refreshComplaints, deleteComplaint } =
    useComplaintContext();
  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = async () => {
    await refreshComplaints();
  };

  const safeComplaints = complaints || [];

  const completedCount = safeComplaints.filter(
    c => c.status === ComplaintStatus.COMPLETED,
  ).length;
  const activeCount = safeComplaints.filter(
    c => c.status !== ComplaintStatus.COMPLETED,
  ).length;

  const filteredComplaints = safeComplaints.filter(item => {
    if (activeFilter === 'All Reports') return true;
    if (activeFilter === 'Completed')
      return item.status === ComplaintStatus.COMPLETED;
    if (activeFilter === 'Pending')
      return (
        item.status === ComplaintStatus.PENDING ||
        item.status === ComplaintStatus.WORKING
      );
    return true;
  });

  const handleDelete = async (id: number) => {
    const success = await deleteComplaint(id);

    if (success) {
      Alert.alert('Complaint deleted');
    }
  };

  const renderHeader = () => (
    <>
      <View style={styles.titleSection}>
        <Text style={styles.kicker}>SUSTAINABLE ARCHIVE</Text>
        <Text style={styles.pageTitle}>Report History</Text>
        <Text style={styles.pageDescription}>
          Tracking your environmental contributions and complaint status across
          your local community.
        </Text>
      </View>

      <View style={styles.impactCard}>
        <Text style={styles.impactTitle}>Impact Summary</Text>
        <Text style={styles.impactSubtitle}>
          Total reports addressed this quarter
        </Text>
        <View style={styles.impactRow}>
          <Text style={styles.impactNumber}>{completedCount}</Text>
          <Text style={styles.impactLabel}>Resolved Issues</Text>
        </View>
        <MaterialCommunityIcons
          name="star-four-points"
          size={40}
          color="rgba(255,255,255,0.1)"
          style={styles.decor1}
        />
        <MaterialCommunityIcons
          name="star-four-points"
          size={24}
          color="rgba(255,255,255,0.1)"
          style={styles.decor2}
        />
      </View>

      <View style={styles.activeCasesCard}>
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={20}
          color="#1F7A38"
        />
        <Text style={styles.activeCasesTitle}>Active cases</Text>
        <Text style={styles.activeCasesNumber}>
          {activeCount.toString().padStart(2, '0')}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        {FILTER_OPTIONS.map(option => {
          const isActive = activeFilter === option;
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterPill,
                isActive ? styles.filterPillActive : styles.filterPillInactive,
              ]}
              onPress={() => setActiveFilter(option)}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive
                    ? styles.filterTextActive
                    : styles.filterTextInactive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
  const renderItem = ({ item }: { item: IComplaint }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => console.log('Navigate to details')}
        activeOpacity={0.7}
      >
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.imagePlaceholder}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="image" size={24} color="#BDBDBD" />
          </View>
        )}

        <View style={styles.cardHeader}>
          <View
            style={[styles.statusTag, { backgroundColor: statusConfig.bg }]}
          >
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
          <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>
        </View>

        <Text style={styles.reportDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaInfo}>
            <Ionicons name="location-outline" size={14} color="black" />
            <Text style={styles.metaText}>
              {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => handleDelete(item.id)}
            >
              <AntDesign name="delete" color="red" size={20} />
            </TouchableOpacity>
            <Feather
              name="chevron-right"
              size={16}
              color="#BDBDBD"
              style={{ marginLeft: 12 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        data={filteredComplaints}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No reports found.</Text>
        }
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  titleSection: {
    marginTop: 10,
    marginBottom: 24,
  },
  kicker: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F7A38',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  pageDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  impactCard: {
    backgroundColor: '#2E7D32',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  impactTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  impactSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 16,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  impactNumber: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '700',
    marginRight: 12,
  },
  impactLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontWeight: '500',
  },
  decor1: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    transform: [{ rotate: '15deg' }],
  },
  decor2: {
    position: 'absolute',
    right: 40,
    top: 20,
  },
  activeCasesCard: {
    backgroundColor: '#EEEEEE',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  activeCasesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginTop: 8,
    marginBottom: 4,
  },
  activeCasesNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  filterPillActive: {
    backgroundColor: '#1F7A38',
  },
  filterPillInactive: {
    backgroundColor: '#EBF4FC',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFF',
  },
  filterTextInactive: {
    color: '#666',
  },
  reportCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#b5b2b2',
    marginBottom: 16, // Added margin bottom for spacing between FlatList items
  },
  imagePlaceholder: {
    height: 120,
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
    color: 'black',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  reportDescription: {
    fontSize: 13,
    color: 'black',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    color: 'black',
    marginLeft: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});
