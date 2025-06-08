import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Trophy, MapPin, Star, Share2, CreditCard as Edit3, Wallet, History, Award, TrendingUp, Calendar, Camera } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface CollectedNFT {
  id: string;
  name: string;
  imageUrl: string;
  category: 'common' | 'rare' | 'epic' | 'legendary';
  collectedAt: string;
  location: string;
  rarity: number;
}

interface UserStats {
  totalNFTs: number;
  totalDistance: number;
  totalScore: number;
  level: number;
  rank: number;
  joinedDate: string;
}

const mockUserStats: UserStats = {
  totalNFTs: 42,
  totalDistance: 123.4,
  totalScore: 8750,
  level: 18,
  rank: 4,
  joinedDate: '2024-01-15',
};

const mockCollectedNFTs: CollectedNFT[] = [
  {
    id: '1',
    name: 'Golden Gate Sunset',
    imageUrl: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'legendary',
    collectedAt: '2024-03-15',
    location: 'Golden Gate Bridge',
    rarity: 95,
  },
  {
    id: '2',
    name: 'Urban Street Art',
    imageUrl: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'rare',
    collectedAt: '2024-03-14',
    location: 'Mission District',
    rarity: 78,
  },
  {
    id: '3',
    name: 'Coffee Shop Vibes',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'common',
    collectedAt: '2024-03-13',
    location: 'Union Square',
    rarity: 45,
  },
  {
    id: '4',
    name: 'Ocean Waves',
    imageUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'epic',
    collectedAt: '2024-03-12',
    location: 'Ocean Beach',
    rarity: 87,
  },
  {
    id: '5',
    name: 'City Lights',
    imageUrl: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'rare',
    collectedAt: '2024-03-11',
    location: 'Downtown',
    rarity: 72,
  },
  {
    id: '6',
    name: 'Park Serenity',
    imageUrl: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'common',
    collectedAt: '2024-03-10',
    location: 'Golden Gate Park',
    rarity: 38,
  },
];

const categoryColors = {
  common: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  rare: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  epic: { bg: '#EDE9FE', text: '#7C3AED', border: '#C4B5FD' },
  legendary: { bg: '#FEF3C7', text: '#D97706', border: '#FCD34D' },
};

export default function ProfileScreen() {
  const [selectedTab, setSelectedTab] = useState<'collection' | 'stats' | 'activity'>('collection');

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const handleShareProfile = () => {
    Alert.alert('Share Profile', 'Share your amazing NFT collection with friends!');
  };

  const handleWalletSettings = () => {
    Alert.alert('Wallet Settings', 'Wallet management features coming soon!');
  };

  const handleNFTPress = (nft: CollectedNFT) => {
    router.push({
      pathname: '/nft/[id]',
      params: { id: nft.id }
    });
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.username}>Alex Explorer</Text>
            <Text style={styles.userTitle}>Rising Star</Text>
            <View style={styles.userLevel}>
              <Star size={16} color="#FFFFFF" />
              <Text style={styles.levelText}>Level {mockUserStats.level}</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={handleEditProfile}>
              <Edit3 size={16} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleShareProfile}>
              <Share2 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUserStats.totalNFTs}</Text>
            <Text style={styles.statLabel}>NFTs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUserStats.totalDistance}km</Text>
            <Text style={styles.statLabel}>Traveled</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>#{mockUserStats.rank}</Text>
            <Text style={styles.statLabel}>Rank</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockUserStats.totalScore.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderTabSelector = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'collection' && styles.activeTab]}
        onPress={() => setSelectedTab('collection')}
      >
        <Trophy size={16} color={selectedTab === 'collection' ? '#FFFFFF' : '#6B7280'} />
        <Text style={[styles.tabText, selectedTab === 'collection' && styles.activeTabText]}>
          Collection
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'stats' && styles.activeTab]}
        onPress={() => setSelectedTab('stats')}
      >
        <TrendingUp size={16} color={selectedTab === 'stats' ? '#FFFFFF' : '#6B7280'} />
        <Text style={[styles.tabText, selectedTab === 'stats' && styles.activeTabText]}>
          Stats
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, selectedTab === 'activity' && styles.activeTab]}
        onPress={() => setSelectedTab('activity')}
      >
        <History size={16} color={selectedTab === 'activity' ? '#FFFFFF' : '#6B7280'} />
        <Text style={[styles.tabText, selectedTab === 'activity' && styles.activeTabText]}>
          Activity
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderNFTGrid = () => (
    <View style={styles.nftGrid}>
      {mockCollectedNFTs.map((nft) => (
        <TouchableOpacity
          key={nft.id}
          style={styles.nftCard}
          onPress={() => handleNFTPress(nft)}
        >
          <Image source={{ uri: nft.imageUrl }} style={styles.nftImage} />
          <View style={styles.nftOverlay}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColors[nft.category].bg }]}>
              <Text style={[styles.categoryText, { color: categoryColors[nft.category].text }]}>
                {nft.category.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.rarityBadge}>
              <Star size={10} color="#F59E0B" />
              <Text style={styles.rarityText}>{nft.rarity}%</Text>
            </View>
          </View>
          <View style={styles.nftInfo}>
            <Text style={styles.nftName} numberOfLines={1}>{nft.name}</Text>
            <Text style={styles.nftLocation} numberOfLines={1}>{nft.location}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStatsView = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Collection Overview</Text>
        <View style={styles.categoryStats}>
          {Object.entries(categoryColors).map(([category, colors]) => {
            const count = mockCollectedNFTs.filter(nft => nft.category === category).length;
            return (
              <View key={category} style={styles.categoryStatItem}>
                <View style={[styles.categoryDot, { backgroundColor: colors.border }]} />
                <Text style={styles.categoryStatLabel}>{category}</Text>
                <Text style={styles.categoryStatCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Achievements</Text>
        <View style={styles.achievementsList}>
          <View style={styles.achievementItem}>
            <Award size={20} color="#F59E0B" />
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>First Collection</Text>
              <Text style={styles.achievementDescription}>Collected your first NFT</Text>
            </View>
            <Text style={styles.achievementDate}>Mar 10</Text>
          </View>
          <View style={styles.achievementItem}>
            <Trophy size={20} color="#10B981" />
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Explorer</Text>
              <Text style={styles.achievementDescription}>Traveled 100km exploring</Text>
            </View>
            <Text style={styles.achievementDate}>Mar 12</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Monthly Progress</Text>
        <View style={styles.progressStats}>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>NFTs This Month</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '70%' }]} />
            </View>
            <Text style={styles.progressText}>14/20</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressLabel}>Distance Goal</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '45%' }]} />
            </View>
            <Text style={styles.progressText}>45/100 km</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActivityView = () => (
    <View style={styles.activityContainer}>
      {mockCollectedNFTs.slice(0, 5).map((nft) => (
        <View key={`activity-${nft.id}`} style={styles.activityItem}>
          <Image source={{ uri: nft.imageUrl }} style={styles.activityImage} />
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>Collected "{nft.name}"</Text>
            <View style={styles.activityDetails}>
              <MapPin size={12} color="#6B7280" />
              <Text style={styles.activityLocation}>{nft.location}</Text>
            </View>
            <View style={styles.activityMeta}>
              <Calendar size={12} color="#6B7280" />
              <Text style={styles.activityDate}>{nft.collectedAt}</Text>
            </View>
          </View>
          <View style={[styles.activityBadge, { backgroundColor: categoryColors[nft.category].bg }]}>
            <Text style={[styles.activityBadgeText, { color: categoryColors[nft.category].text }]}>
              {nft.category}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity style={styles.actionButton} onPress={handleWalletSettings}>
        <Wallet size={20} color="#6B7280" />
        <Text style={styles.actionButtonText}>Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Settings size={20} color="#6B7280" />
        <Text style={styles.actionButtonText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <History size={20} color="#6B7280" />
        <Text style={styles.actionButtonText}>History</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        {renderProfileHeader()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Tab Selector */}
        {renderTabSelector()}

        {/* Content */}
        <View style={styles.content}>
          {selectedTab === 'collection' && renderNFTGrid()}
          {selectedTab === 'stats' && renderStatsView()}
          {selectedTab === 'activity' && renderActivityView()}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileHeader: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userTitle: {
    fontSize: 16,
    color: '#FEF3C7',
    marginTop: 4,
  },
  userLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  levelText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FEF3C7',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#F59E0B',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 20,
  },
  nftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  nftCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  nftImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  nftOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginLeft: 2,
    fontWeight: '600',
  },
  nftInfo: {
    padding: 12,
  },
  nftName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  nftLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  statsContainer: {
    gap: 16,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statsCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  categoryStats: {
    gap: 12,
  },
  categoryStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryStatLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    textTransform: 'capitalize',
  },
  categoryStatCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressStats: {
    gap: 16,
  },
  progressItem: {
    gap: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'right',
  },
  activityContainer: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  activityDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  activityLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  activityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  bottomSpacing: {
    height: 20,
  },
});