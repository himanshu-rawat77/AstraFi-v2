import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trophy,
  Medal,
  Star,
  TrendingUp,
  Users,
  MapPin,
  Crown,
  Zap,
  Target,
  Award,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface LeaderboardUser {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  score: number;
  nftsCollected: number;
  distanceTraveled: number;
  level: number;
  badge: string;
  isCurrentUser?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  reward: string;
}

const mockLeaderboard: LeaderboardUser[] = [
  {
    id: '1',
    rank: 1,
    username: 'CryptoExplorer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    score: 15420,
    nftsCollected: 89,
    distanceTraveled: 234.5,
    level: 28,
    badge: 'Legendary Explorer',
  },
  {
    id: '2',
    rank: 2,
    username: 'NFTHunter',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    score: 12890,
    nftsCollected: 67,
    distanceTraveled: 189.2,
    level: 24,
    badge: 'Master Collector',
  },
  {
    id: '3',
    rank: 3,
    username: 'DigitalNomad',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400',
    score: 11250,
    nftsCollected: 54,
    distanceTraveled: 167.8,
    level: 22,
    badge: 'Epic Wanderer',
  },
  {
    id: '4',
    rank: 4,
    username: 'You',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    score: 8750,
    nftsCollected: 42,
    distanceTraveled: 123.4,
    level: 18,
    badge: 'Rising Star',
    isCurrentUser: true,
  },
  {
    id: '5',
    rank: 5,
    username: 'BlockchainWalker',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    score: 7890,
    nftsCollected: 38,
    distanceTraveled: 98.7,
    level: 16,
    badge: 'Dedicated Seeker',
  },
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Collect your first NFT',
    icon: '🎯',
    rarity: 'common',
    progress: 1,
    maxProgress: 1,
    reward: '100 XP',
  },
  {
    id: '2',
    title: 'Coffee Connoisseur',
    description: 'Visit 10 coffee shops',
    icon: '☕',
    rarity: 'rare',
    progress: 7,
    maxProgress: 10,
    reward: 'Coffee Master NFT',
  },
  {
    id: '3',
    title: 'Distance Walker',
    description: 'Travel 100km exploring',
    icon: '🚶',
    rarity: 'epic',
    progress: 67,
    maxProgress: 100,
    reward: 'Explorer Badge + 500 XP',
  },
  {
    id: '4',
    title: 'Legendary Collector',
    description: 'Collect 50 NFTs',
    icon: '👑',
    rarity: 'legendary',
    progress: 42,
    maxProgress: 50,
    reward: 'Legendary Crown NFT',
  },
];

const rarityColors = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};

export default function LeaderboardScreen() {
  const [selectedTab, setSelectedTab] = useState<'leaderboard' | 'achievements'>('leaderboard');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={20} color="#FFD700" />;
      case 2:
        return <Medal size={20} color="#C0C0C0" />;
      case 3:
        return <Medal size={20} color="#CD7F32" />;
      default:
        return <Text style={styles.rankNumber}>{rank}</Text>;
    }
  };

  const renderLeaderboardItem = (user: LeaderboardUser) => (
    <View
      key={user.id}
      style={[
        styles.leaderboardItem,
        user.isCurrentUser && styles.currentUserItem,
      ]}
    >
      <View style={styles.rankContainer}>
        {getRankIcon(user.rank)}
      </View>

      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      <View style={styles.userInfo}>
        <Text style={[styles.username, user.isCurrentUser && styles.currentUsername]}>
          {user.username}
        </Text>
        <Text style={styles.userBadge}>{user.badge}</Text>
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Star size={12} color="#F59E0B" />
            <Text style={styles.statText}>{user.score.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <Trophy size={12} color="#6B7280" />
            <Text style={styles.statText}>{user.nftsCollected}</Text>
          </View>
        </View>
      </View>

      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>LV</Text>
        <Text style={styles.levelNumber}>{user.level}</Text>
      </View>
    </View>
  );

  const renderAchievementItem = (achievement: Achievement) => {
    const isCompleted = achievement.progress >= achievement.maxProgress;
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;

    return (
      <View key={achievement.id} style={styles.achievementItem}>
        <View style={styles.achievementIcon}>
          <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
        </View>

        <View style={styles.achievementInfo}>
          <View style={styles.achievementHeader}>
            <Text style={styles.achievementTitle}>{achievement.title}</Text>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColors[achievement.rarity] }]}>
              <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={styles.achievementDescription}>{achievement.description}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {achievement.progress}/{achievement.maxProgress}
            </Text>
          </View>

          <View style={styles.rewardContainer}>
            <Award size={12} color="#F59E0B" />
            <Text style={styles.rewardText}>{achievement.reward}</Text>
          </View>
        </View>

        {isCompleted && (
          <View style={styles.completedBadge}>
            <Trophy size={16} color="#10B981" />
          </View>
        )}
      </View>
    );
  };

  const renderTopThree = () => (
    <View style={styles.topThreeContainer}>
      {/* Second Place */}
      <View style={styles.podiumItem}>
        <Image source={{ uri: mockLeaderboard[1].avatar }} style={styles.podiumAvatar} />
        <View style={[styles.podiumRank, styles.secondPlace]}>
          <Medal size={16} color="#C0C0C0" />
        </View>
        <Text style={styles.podiumName}>{mockLeaderboard[1].username}</Text>
        <Text style={styles.podiumScore}>{mockLeaderboard[1].score.toLocaleString()}</Text>
        <View style={styles.podiumHeight2} />
      </View>

      {/* First Place */}
      <View style={styles.podiumItem}>
        <Image source={{ uri: mockLeaderboard[0].avatar }} style={styles.podiumAvatar} />
        <View style={[styles.podiumRank, styles.firstPlace]}>
          <Crown size={16} color="#FFD700" />
        </View>
        <Text style={styles.podiumName}>{mockLeaderboard[0].username}</Text>
        <Text style={styles.podiumScore}>{mockLeaderboard[0].score.toLocaleString()}</Text>
        <View style={styles.podiumHeight1} />
      </View>

      {/* Third Place */}
      <View style={styles.podiumItem}>
        <Image source={{ uri: mockLeaderboard[2].avatar }} style={styles.podiumAvatar} />
        <View style={[styles.podiumRank, styles.thirdPlace]}>
          <Medal size={16} color="#CD7F32" />
        </View>
        <Text style={styles.podiumName}>{mockLeaderboard[2].username}</Text>
        <Text style={styles.podiumScore}>{mockLeaderboard[2].score.toLocaleString()}</Text>
        <View style={styles.podiumHeight3} />
      </View>
    </View>
  );

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        style={styles.statsGradient}
      >
        <View style={styles.statsContent}>
          <Text style={styles.statsTitle}>Your Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Zap size={20} color="#FFFFFF" />
              <Text style={styles.statNumber}>8,750</Text>
              <Text style={styles.statLabel}>Total Score</Text>
            </View>
            <View style={styles.statBox}>
              <Trophy size={20} color="#FFFFFF" />
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>NFTs Collected</Text>
            </View>
            <View style={styles.statBox}>
              <MapPin size={20} color="#FFFFFF" />
              <Text style={styles.statNumber}>123.4</Text>
              <Text style={styles.statLabel}>KM Traveled</Text>
            </View>
            <View style={styles.statBox}>
              <Target size={20} color="#FFFFFF" />
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Leaderboard</Text>
            <Text style={styles.subtitle}>Compete with other explorers</Text>
          </View>
          <TouchableOpacity style={styles.trophyButton}>
            <Trophy size={20} color="#F59E0B" />
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'leaderboard' && styles.activeTab]}
            onPress={() => setSelectedTab('leaderboard')}
          >
            <Users size={16} color={selectedTab === 'leaderboard' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.tabText, selectedTab === 'leaderboard' && styles.activeTabText]}>
              Leaderboard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'achievements' && styles.activeTab]}
            onPress={() => setSelectedTab('achievements')}
          >
            <Award size={16} color={selectedTab === 'achievements' ? '#FFFFFF' : '#6B7280'} />
            <Text style={[styles.tabText, selectedTab === 'achievements' && styles.activeTabText]}>
              Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {selectedTab === 'leaderboard' ? (
          <>
            {/* Top Three Podium */}
            {renderTopThree()}

            {/* Stats Card */}
            {renderStatsCard()}

            {/* Full Leaderboard */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Full Rankings</Text>
              <View style={styles.leaderboardList}>
                {mockLeaderboard.map(renderLeaderboardItem)}
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Achievements Progress */}
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Your Progress</Text>
              <View style={styles.achievementsStats}>
                <Text style={styles.achievementsCompleted}>3/12 Completed</Text>
                <View style={styles.achievementsProgress}>
                  <View style={[styles.achievementsProgressFill, { width: '25%' }]} />
                </View>
              </View>
            </View>

            {/* Achievements List */}
            <View style={styles.section}>
              <View style={styles.achievementsList}>
                {mockAchievements.map(renderAchievementItem)}
              </View>
            </View>
          </>
        )}

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  trophyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 15,
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
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  podiumRank: {
    position: 'absolute',
    top: 45,
    right: '50%',
    transform: [{ translateX: 15 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  firstPlace: {
    backgroundColor: '#FEF3C7',
  },
  secondPlace: {
    backgroundColor: '#F3F4F6',
  },
  thirdPlace: {
    backgroundColor: '#FED7AA',
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  podiumHeight1: {
    width: '100%',
    height: 80,
    backgroundColor: '#F59E0B',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  podiumHeight2: {
    width: '100%',
    height: 60,
    backgroundColor: '#6B7280',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  podiumHeight3: {
    width: '100%',
    height: 40,
    backgroundColor: '#D97706',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  statsCard: {
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 20,
  },
  statsContent: {
    gap: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#FEF3C7',
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardItem: {
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
  currentUserItem: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  currentUsername: {
    color: '#D97706',
  },
  userBadge: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  userStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  levelContainer: {
    alignItems: 'center',
  },
  levelText: {
    fontSize: 10,
    color: '#6B7280',
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  achievementsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  achievementsStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  achievementsCompleted: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  achievementsProgress: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  achievementsProgressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
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
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementEmoji: {
    fontSize: 20,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  rarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});