import { Image, StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import { IComplaint } from '../types/Complaint';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { RefreshControl } from 'react-native-gesture-handler';

export const getColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return '#FF9800';
    case 'IN_PROGRESS':
      return '#2196F3';
    case 'RESOLVED':
      return '#4CAF50';
    default:
      return '#888';
  }
};

type ComplaintListProps = {
  complaints: IComplaint[];
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  contentContainerStyle?: object;
  refreshing:boolean,
  onRefresh:()=>Promise<void>

};

const ComplaintList = ({ 
  complaints, 
  ListHeaderComponent, 
  ListFooterComponent, 
  contentContainerStyle ,
  refreshing,
  onRefresh
  
}: ComplaintListProps) => {
  const formatTime = (date: string) => {
    return new Date(date).toLocaleDateString();
  };


  const renderItem = ({ item }: { item: IComplaint }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.status, { color: getColor(item.status) }]}>
            {item.status}
          </Text>
          <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Ionicons name="location-outline" size={14} color="#777" />
            <Text style={styles.footerText}>
              {item.latitude.toFixed(2)}, {item.longitude.toFixed(2)}
            </Text>
          </View>

          <View style={styles.footerItem}>
            <Feather
              name="check-circle"
              size={14}
              color={getColor(item.status)}
            />
            <Text style={[styles.footerText, { color: getColor(item.status) }]}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
     refreshControl={
                     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                   }
      data={complaints.slice(0, 3)}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.listContainer, contentContainerStyle]}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponentStyle={{ marginBottom: 12 }}
      ListFooterComponentStyle={{ marginTop: 20 }}
    />
  );
};

export default ComplaintList;

const styles = StyleSheet.create({
  listContainer: {
    padding: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    margin: 3,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 11,
    color: '#888',
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    marginVertical: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});