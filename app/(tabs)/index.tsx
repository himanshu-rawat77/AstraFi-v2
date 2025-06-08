import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Search,
  Filter,
  MapPin,
  Star,
  Navigation,
  Sparkles,
  TrendingUp,
  Clock,
  Users,
  Compass,
  Target,
  Award,
  Zap,
  Eye,
  Heart,
} from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: 'common' | 'rare' | 'epic' | 'legendary';
  location: {
    lat: number;
    lng: number;
    address: string;
    shopName: string;
  };
  distance?: number;
  rarity: number;
  claimedBy: number;
  timeLeft?: string;
  views: number;
  likes: number;
  experience: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isNew?: boolean;
  isTrending?: boolean;
}

const mockNFTs: NFT[] = [
  {
    id: '1',
    name: 'Golden Gate Sunset',
    description: 'A breathtaking view of the Golden Gate Bridge at sunset, captured in digital form.',
    imageUrl: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'legendary',
    location: {
      lat: 37.8199,
      lng: -122.4783,
      address: 'Golden Gate Bridge, San Francisco, CA',
      shopName: 'Golden Gate Cafe',
    },
    distance: 0.5,
    rarity: 95,
    claimedBy: 23,
    timeLeft: '2h 15m',
    views: 1247,
    likes: 89,
    experience: 500,
    difficulty: 'medium',
    isTrending: true,
  },
  {
    id: '2',
    name: 'Urban Street Art',
    description: 'Vibrant street art from the heart of the city, immortalized as an NFT.',
    imageUrl: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'rare',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: 'Mission District, San Francisco, CA',
      shopName: 'Art Corner Gallery',
    },
    distance: 1.2,
    rarity: 78,
    claimedBy: 156,
    views: 892,
    likes: 67,
    experience: 250,
    difficulty: 'easy',
  },
  {
    id: '3',
    name: 'Coffee Shop Vibes',
    description: 'The perfect morning coffee moment, captured in this cozy cafe NFT.',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'common',
    location: {
      lat: 37.7849,
      lng: -122.4094,
      address: 'Union Square, San Francisco, CA',
      shopName: 'Blue Bottle Coffee',
    },
    distance: 0.8,
    rarity: 45,
    claimedBy: 892,
    views: 2341,
    likes: 234,
    experience: 100,
    difficulty: 'easy',
    isNew: true,
  },
  {
    id: '4',
    name: 'Ocean Waves',
    description: 'The eternal dance of ocean waves against the shore.',
    imageUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'epic',
    location: {
      lat: 37.8044,
      lng: -122.4679,
      address: 'Ocean Beach, San Francisco, CA',
      shopName: 'Seaside Bistro',
    },
    distance: 2.1,
    rarity: 87,
    claimedBy: 67,
    timeLeft: '1d 5h',
    views: 1567,
    likes: 123,
    experience: 350,
    difficulty: 'hard',
    isTrending: true,
  },
  {
    id: '5',
    name: 'City Lights',
    description: 'The mesmerizing glow of the city at night, captured from Twin Peaks.',
    imageUrl: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'rare',
    location: {
      lat: 37.7544,
      lng: -122.4477,
      address: 'Twin Peaks, San Francisco, CA',
      shopName: 'Peak View Cafe',
    },
    distance: 3.2,
    rarity: 72,
    claimedBy: 234,
    views: 1834,
    likes: 156,
    experience: 300,
    difficulty: 'medium',
  },
  {
    id: '6',
    name: 'Park Serenity',
    description: 'A peaceful moment in Golden Gate Park, surrounded by nature.',
    imageUrl: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'common',
    location: {
      lat: 37.7694,
      lng: -122.4862,
      address: 'Golden Gate Park, San Francisco, CA',
      shopName: 'Park Pavilion',
    },
    distance: 1.8,
    rarity: 38,
    claimedBy: 567,
    views: 1245,
    likes: 98,
    experience: 150,
    difficulty: 'easy',
    isNew: true,
  },
];

const categoryColors = {
  common: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
  rare: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  epic: { bg: '#EDE9FE', text: '#7C3AED', border: '#C4B5FD' },
  legendary: { bg: '#FEF3C7', text: '#D97706', border: '#FCD34D' },
};

const difficultyColors = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [nfts, setNfts] = useState<NFT[]>(mockNFTs);
  const [featuredNFT, setFeaturedNFT] = useState<NFT>(mockNFTs[0]);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredNFTs = nfts.filter(nft => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.location.shopName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || nft.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const trendingNFTs = nfts.filter(nft => nft.isTrending);
  const newNFTs = nfts.filter(nft => nft.isNew);

  const handleNFTPress = (nft: NFT) => {
    router.push(`/nft/${nft.id}`);
  };

  const handleNavigateToNFT = (nft: NFT) => {
    router.push({
      pathname: '/(tabs)/map',
      params: { nftId: nft.id }
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getCategoryColor = (category: string) => {
    return (
      categoryColors[category as keyof typeof categoryColors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const renderCategoryFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
      {['all', 'common', 'rare', 'epic', 'legendary'].map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive,
            ]}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderFeaturedNFT = () => (
    <TouchableOpacity style={styles.featuredCard} onPress={() => handleNFTPress(featuredNFT)}>
      <Image source={{ uri: featuredNFT.imageUrl }} style={styles.featuredImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColors[featuredNFT.category].bg }]}>
              <Sparkles size={12} color={categoryColors[featuredNFT.category].text} />
              <Text style={[styles.categoryBadgeText, { color: categoryColors[featuredNFT.category].text }]}>
                {featuredNFT.category.toUpperCase()}
              </Text>
            </View>
            {featuredNFT.timeLeft && (
              <View style={styles.timeLeftBadge}>
                <Clock size={12} color="#EF4444" />
                <Text style={styles.timeLeftText}>{featuredNFT.timeLeft}</Text>
              </View>
            )}
          </View>
          <Text style={styles.featuredTitle}>{featuredNFT.name}</Text>
          <View style={styles.featuredLocation}>
            <MapPin size={14} color="#F59E0B" />
            <Text style={styles.featuredLocationText}>{featuredNFT.location.shopName}</Text>
            <Text style={styles.featuredDistance}>{featuredNFT.distance}km away</Text>
          </View>
          <View style={styles.featuredStats}>
            <View style={styles.statItem}>
              <Star size={14} color="#F59E0B" />
              <Text style={styles.statText}>{featuredNFT.rarity}% rare</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={14} color="#6B7280" />
              <Text style={styles.statText}>{featuredNFT.claimedBy} claimed</Text>
            </View>
            <View style={styles.statItem}>
              <Eye size={14} color="#6B7280" />
              <Text style={styles.statText}>{featuredNFT.views}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderNFTCard = (nft: NFT) => (
    <TouchableOpacity
      key={nft.id}
      style={styles.nftCard}
      onPress={() => handleNFTPress(nft)}
    >
      <View style={styles.nftImageContainer}>
        <Image source={{ uri: nft.imageUrl }} style={styles.nftImage} />
        {nft.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
        {nft.isTrending && (
          <View style={styles.trendingBadge}>
            <TrendingUp size={12} color="#EF4444" />
          </View>
        )}
      </View>
      
      <View style={styles.nftContent}>
        <View style={styles.nftHeader}>
          <Text style={styles.nftTitle} numberOfLines={1}>{nft.name}</Text>
          <View style={[styles.categoryDot, { backgroundColor: categoryColors[nft.category].border }]} />
        </View>
        
        <View style={styles.nftLocation}>
          <MapPin size={12} color="#6B7280" />
          <Text style={styles.nftLocationText} numberOfLines={1}>{nft.location.shopName}</Text>
        </View>
        
        <View style={styles.nftStats}>
          <View style={styles.nftStatRow}>
            <View style={styles.nftStatItem}>
              <Star size={12} color="#F59E0B" />
              <Text style={styles.nftStatText}>{nft.rarity}%</Text>
            </View>
            <View style={styles.nftStatItem}>
              <Zap size={12} color={difficultyColors[nft.difficulty]} />
              <Text style={[styles.nftStatText, { color: difficultyColors[nft.difficulty] }]}>
                {nft.experience} XP
              </Text>
            </View>
          </View>
          
          <View style={styles.nftStatRow}>
            <View style={styles.nftStatItem}>
              <Heart size={12} color="#EF4444" />
              <Text style={styles.nftStatText}>{nft.likes}</Text>
            </View>
            <Text style={styles.nftDistance}>{nft.distance}km</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={(e) => {
            e.stopPropagation();
            handleNavigateToNFT(nft);
          }}
        >
          <Navigation size={14} color="#FFFFFF" />
          <Text style={styles.navigateButtonText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title: string, items: NFT[], showAll = false) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {!showAll && items.length > 2 && (
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {showAll ? (
        <View style={styles.nftGrid}>
          {items.map(renderNFTCard)}
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.horizontalList}>
            {items.slice(0, 3).map(renderNFTCard)}
          </View>
        </ScrollView>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Discover NFTs</Text>
            <Text style={styles.subtitle}>Find digital treasures near you</Text>
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search NFTs or locations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Category Filter */}
        {renderCategoryFilter()}

        {/* Featured NFT */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured NFT</Text>
            <View style={styles.trendingBadge}>
              <TrendingUp size={14} color="#EF4444" />
              <Text style={styles.trendingText}>Hot</Text>
            </View>
          </View>
          {renderFeaturedNFT()}
        </View>

        {/* Trending NFTs */}
        {trendingNFTs.length > 0 && renderSection('Trending Now', trendingNFTs)}

        {/* New NFTs */}
        {newNFTs.length > 0 && renderSection('Recently Added', newNFTs)}

        {/* All NFTs */}
        {renderSection('Nearby NFTs', filteredNFTs, true)}

        {/* Empty State */}
        {filteredNFTs.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Compass size={48} color="#F59E0B" />
            </View>
            <Text style={styles.emptyStateTitle}>No NFTs Found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your filters or explore different areas to find NFTs.
            </Text>
          </View>
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: '#FFFFFF',
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
  seeAllText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
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
  featuredCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F9FAFB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
  },
  featuredContent: {
    padding: 20,
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  timeLeftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
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
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredLocationText: {
    fontSize: 14,
    color: '#F9FAFB',
    marginLeft: 6,
    marginRight: 8,
  },
  featuredDistance: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  featuredStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#F9FAFB',
    marginLeft: 4,
  },
  horizontalList: {
    flexDirection: 'row',
    gap: 16,
  },
  nftGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  nftCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  nftImageContainer: {
    position: 'relative',
  },
  nftImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: 'cover',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  trendingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FEF2F2',
    padding: 4,
    borderRadius: 8,
  },
  nftContent: {
    padding: 12,
  },
  nftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nftTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  nftLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  nftLocationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  nftStats: {
    marginBottom: 12,
    gap: 4,
  },
  nftStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nftStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nftStatText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  nftDistance: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    borderRadius: 8,
  },
  navigateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  bottomSpacing: {
    height: 20,
  },
});