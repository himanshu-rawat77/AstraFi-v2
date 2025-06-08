import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Compass,
  MapPin,
  Star,
  Clock,
  Zap,
  TrendingUp,
  Award,
  Users,
  Target,
  Sparkles,
} from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface DiscoveryItem {
  id: string;
  type: 'quest' | 'challenge' | 'event' | 'treasure';
  title: string;
  description: string;
  imageUrl: string;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLeft?: string;
  participants?: number;
  location: string;
  distance: number;
  progress?: number;
}

const mockDiscoveryItems: DiscoveryItem[] = [
  {
    id: '1',
    type: 'quest',
    title: 'Coffee Shop Explorer',
    description: 'Visit 5 different coffee shops in the Mission District to unlock the exclusive Coffee Master NFT.',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    reward: 'Coffee Master NFT + 500 XP',
    difficulty: 'medium',
    timeLeft: '3 days',
    participants: 234,
    location: 'Mission District',
    distance: 1.2,
    progress: 60,
  },
  {
    id: '2',
    type: 'challenge',
    title: 'Golden Hour Hunt',
    description: 'Capture the perfect sunset photo at 3 iconic SF locations during golden hour.',
    imageUrl: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=800',
    reward: 'Golden Hour NFT + 750 XP',
    difficulty: 'hard',
    timeLeft: '2h 15m',
    participants: 89,
    location: 'Multiple Locations',
    distance: 0.8,
    progress: 33,
  },
  {
    id: '3',
    type: 'event',
    title: 'Street Art Festival',
    description: 'Join the community event to discover hidden street art pieces and mint exclusive NFTs.',
    imageUrl: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=800',
    reward: 'Festival Badge + Mystery NFT',
    difficulty: 'easy',
    timeLeft: '6 hours',
    participants: 456,
    location: 'Castro District',
    distance: 2.1,
  },
  {
    id: '4',
    type: 'treasure',
    title: 'Hidden Gem Discovery',
    description: 'Find the secret location using cryptic clues to unlock a rare treasure NFT.',
    imageUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
    reward: 'Treasure Hunter NFT + 1000 XP',
    difficulty: 'hard',
    participants: 67,
    location: 'Unknown',
    distance: 0.5,
  },
];

const typeColors = {
  quest: { bg: '#DBEAFE', text: '#1E40AF', icon: '#3B82F6' },
  challenge: { bg: '#FEF3C7', text: '#D97706', icon: '#F59E0B' },
  event: { bg: '#D1FAE5', text: '#047857', icon: '#10B981' },
  treasure: { bg: '#EDE9FE', text: '#7C3AED', icon: '#8B5CF6' },
};

const difficultyColors = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

export default function DiscoverScreen() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const filteredItems = mockDiscoveryItems.filter(item => 
    selectedType === 'all' || item.type === selectedType
  );

  const handleItemPress = (item: DiscoveryItem) => {
    router.push({
      pathname: '/discovery/[id]',
      params: { id: item.id }
    });
  };

  const renderTypeFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeContainer}>
      {['all', 'quest', 'challenge', 'event', 'treasure'].map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.typeButton,
            selectedType === type && styles.typeButtonActive,
          ]}
          onPress={() => setSelectedType(type)}
        >
          <Text
            style={[
              styles.typeText,
              selectedType === type && styles.typeTextActive,
            ]}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDiscoveryCard = (item: DiscoveryItem) => {
    const typeColor = typeColors[item.type];
    const difficultyColor = difficultyColors[item.difficulty];

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.discoveryCard}
        onPress={() => handleItemPress(item)}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={[styles.typeBadge, { backgroundColor: typeColor.bg }]}>
                <Text style={[styles.typeBadgeText, { color: typeColor.text }]}>
                  {item.type.toUpperCase()}
                </Text>
              </View>
              {item.timeLeft && (
                <View style={styles.timeLeftBadge}>
                  <Clock size={12} color="#EF4444" />
                  <Text style={styles.timeLeftText}>{item.timeLeft}</Text>
                </View>
              )}
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.cardStats}>
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <MapPin size={14} color="#F59E0B" />
                  <Text style={styles.statText}>{item.distance}km away</Text>
                </View>
                <View style={styles.statItem}>
                  <Users size={14} color="#6B7280" />
                  <Text style={styles.statText}>{item.participants || 0}</Text>
                </View>
              </View>
              
              <View style={styles.statRow}>
                <View style={styles.statItem}>
                  <Target size={14} color={difficultyColor} />
                  <Text style={[styles.statText, { color: difficultyColor }]}>
                    {item.difficulty}
                  </Text>
                </View>
                <View style={styles.rewardContainer}>
                  <Award size={14} color="#F59E0B" />
                  <Text style={styles.rewardText}>{item.reward}</Text>
                </View>
              </View>
            </View>

            {item.progress !== undefined && (
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{item.progress}% complete</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderStatsCard = () => (
    <View style={styles.statsCard}>
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        style={styles.statsGradient}
      >
        <View style={styles.statsContent}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Your Discovery Stats</Text>
            <Animated.View
              style={{
                transform: [{
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
              }}
            >
              <Compass size={24} color="#FFFFFF" />
            </Animated.View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Quests</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Challenges</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>2,450</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>NFTs</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderTrendingSection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
        <View style={styles.trendingBadge}>
          <TrendingUp size={14} color="#EF4444" />
          <Text style={styles.trendingText}>Hot</Text>
        </View>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.trendingContainer}>
          {mockDiscoveryItems.slice(0, 2).map((item) => (
            <TouchableOpacity
              key={`trending-${item.id}`}
              style={styles.trendingCard}
              onPress={() => handleItemPress(item)}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.trendingImage} />
              <View style={styles.trendingContent}>
                <Text style={styles.trendingTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.trendingStats}>
                  <Sparkles size={12} color="#F59E0B" />
                  <Text style={styles.trendingParticipants}>{item.participants} joined</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Discover Adventures</Text>
            <Text style={styles.subtitle}>Explore quests, challenges & events</Text>
          </View>
          <TouchableOpacity style={styles.compassButton}>
            <Animated.View
              style={{
                transform: [{
                  rotate: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                }],
              }}
            >
              <Compass size={20} color="#F59E0B" />
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        {renderStatsCard()}

        {/* Trending Section */}
        {renderTrendingSection()}

        {/* Type Filter */}
        {renderTypeFilter()}

        {/* Discovery Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Adventures</Text>
          <View style={styles.discoveryGrid}>
            {filteredItems.map(renderDiscoveryCard)}
          </View>
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
  compassButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCD34D',
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
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#FEF3C7',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  trendingContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  trendingCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  trendingImage: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  trendingContent: {
    padding: 12,
  },
  trendingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  trendingStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingParticipants: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  typeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  typeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  discoveryGrid: {
    gap: 20,
  },
  discoveryCard: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    justifyContent: 'flex-end',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  timeLeftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timeLeftText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#F3F4F6',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardStats: {
    gap: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: '#F9FAFB',
    marginLeft: 4,
    fontWeight: '500',
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rewardText: {
    fontSize: 12,
    color: '#FCD34D',
    marginLeft: 4,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
  },
  progressText: {
    fontSize: 12,
    color: '#F9FAFB',
    marginTop: 4,
    textAlign: 'right',
  },
  bottomSpacing: {
    height: 20,
  },
});