import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Feather from 'react-native-vector-icons/Feather';

const Header = () => {
  return (
      <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Feather name="leaf" size={24} color="#1F7A38" />
              <Text style={styles.logoText}>Eco-Reporter</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Feather name="bell" size={20} color="#111" />
              </TouchableOpacity>
              <View style={styles.profileAvatar} />
            </View>
          </View>
  )
}

export default Header

const styles = StyleSheet.create({ container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Leave space for bottom nav bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#FCFCFC',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F7A38',
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
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
  listContainer: {
    gap: 16,
  },
  reportCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  imagePlaceholder: {
    height: 120,
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
    color: '#888',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  reportDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  chevronContainer: {
    alignItems: 'flex-start',
    marginTop: 4,
  },
});