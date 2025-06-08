import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  ArrowLeft,
  Share2,
  MapPin,
  Star,
  Navigation,
  Award,
  Clock,
  Users,
  ExternalLink,
  Heart,
  Bookmark,
  Eye,
  Calendar,
  Zap,
  Trophy,
  Gift,
  Camera,
  Download,
} from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

interface NFTDetail {
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
  rarity: number;
  claimedBy: number;
  timeLeft?: string;
  rewards: string[];
  attributes: { trait_type: string; value: string; rarity?: number }[];
  creator: string;
  mintAddress?: string;
  isCollected?: boolean;
  collectionDate?: string;
  views: number;
  likes: number;
  price?: number;
  estimatedValue?: number;
  distance?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  experience: number;
  tags: string[];
  story: string;
  tips: string[];
}

const mockNFTDetails: { [key: string]: NFTDetail } = {
  '1': {
    id: '1',
    name: 'Golden Gate Sunset',
    description: 'A breathtaking view of the Golden Gate Bridge at sunset, captured in digital form. This NFT represents one of San Francisco\'s most iconic moments, when the golden hour light perfectly illuminates the famous bridge. Collected at the Golden Gate Cafe, this piece comes with exclusive rewards and represents the beauty of urban exploration.',
    imageUrl: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'legendary',
    location: {
      lat: 37.8199,
      lng: -122.4783,
      address: 'Golden Gate Bridge, San Francisco, CA',
      shopName: 'Golden Gate Cafe',
    },
    rarity: 95,
    claimedBy: 23,
    timeLeft: '2h 15m',
    rewards: ['10% off at Golden Gate Cafe', '500 XP Bonus', 'Exclusive Badge', 'Free Coffee for a Week'],
    attributes: [
      { trait_type: 'Location', value: 'Golden Gate Bridge', rarity: 95 },
      { trait_type: 'Time of Day', value: 'Sunset', rarity: 78 },
      { trait_type: 'Weather', value: 'Clear', rarity: 65 },
      { trait_type: 'Season', value: 'Summer', rarity: 45 },
      { trait_type: 'Photographer', value: 'Alex Chen', rarity: 88 },
      { trait_type: 'Camera', value: 'iPhone 15 Pro', rarity: 32 },
    ],
    creator: 'SolSpots Team',
    mintAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    isCollected: false,
    views: 1247,
    likes: 89,
    price: 0.5,
    estimatedValue: 1.2,
    distance: 0.5,
    difficulty: 'medium',
    experience: 500,
    tags: ['sunset', 'bridge', 'iconic', 'photography', 'golden-hour'],
    story: 'This NFT was created during a magical evening when the fog cleared just as the sun was setting, creating perfect lighting conditions that photographers dream of. The Golden Gate Bridge stood majestically against the orange and pink sky, creating a moment that will be remembered forever.',
    tips: [
      'Best time to visit is 30 minutes before sunset',
      'Bring a jacket - it gets windy near the bridge',
      'Check the fog forecast before heading out',
      'The cafe offers the best vantage point for photos'
    ],
  },
  '2': {
    id: '2',
    name: 'Urban Street Art',
    description: 'Vibrant street art from the heart of the city, immortalized as an NFT. This piece showcases the raw creativity and cultural expression found in San Francisco\'s Mission District.',
    imageUrl: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'rare',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: 'Mission District, San Francisco, CA',
      shopName: 'Art Corner Gallery',
    },
    rarity: 78,
    claimedBy: 156,
    rewards: ['5% off at Art Corner Gallery', '250 XP', 'Artist Meet & Greet'],
    attributes: [
      { trait_type: 'Location', value: 'Mission District', rarity: 67 },
      { trait_type: 'Art Style', value: 'Street Art', rarity: 78 },
      { trait_type: 'Artist', value: 'Unknown', rarity: 92 },
      { trait_type: 'Colors', value: 'Vibrant', rarity: 45 },
    ],
    creator: 'Local Artist Collective',
    isCollected: true,
    collectionDate: '2024-03-14',
    views: 892,
    likes: 67,
    price: 0.2,
    estimatedValue: 0.4,
    distance: 1.2,
    difficulty: 'easy',
    experience: 250,
    tags: ['street-art', 'urban', 'culture', 'mission', 'colorful'],
    story: 'Discovered during a cultural walking tour of the Mission District, this street art represents the vibrant artistic community that calls this neighborhood home.',
    tips: [
      'Explore the entire block for more street art',
      'Visit during daylight for best photo quality',
      'Respect the art and the community',
      'Support local artists by visiting the gallery'
    ],
  },
  '3': {
    id: '3',
    name: 'Coffee Shop Vibes',
    description: 'The perfect morning coffee moment, captured in this cozy cafe NFT. Experience the warmth and community of San Francisco\'s coffee culture.',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'common',
    location: {
      lat: 37.7849,
      lng: -122.4094,
      address: 'Union Square, San Francisco, CA',
      shopName: 'Blue Bottle Coffee',
    },
    rarity: 45,
    claimedBy: 892,
    rewards: ['Free coffee upgrade', '100 XP', 'Loyalty points'],
    attributes: [
      { trait_type: 'Location', value: 'Union Square', rarity: 34 },
      { trait_type: 'Beverage', value: 'Latte', rarity: 23 },
      { trait_type: 'Time', value: 'Morning', rarity: 45 },
      { trait_type: 'Atmosphere', value: 'Cozy', rarity: 56 },
    ],
    creator: 'Coffee Enthusiasts',
    isCollected: false,
    views: 2341,
    likes: 234,
    price: 0.1,
    estimatedValue: 0.15,
    distance: 0.8,
    difficulty: 'easy',
    experience: 100,
    tags: ['coffee', 'morning', 'cozy', 'urban', 'lifestyle'],
    story: 'Captured during the morning rush, this NFT embodies the daily ritual that brings the city to life - the perfect cup of coffee.',
    tips: [
      'Order the signature blend for the full experience',
      'Best time is between 8-10 AM',
      'Try the pastries - they\'re locally made',
      'Bring a book and enjoy the atmosphere'
    ],
  },
  '4': {
    id: '4',
    name: 'Ocean Waves',
    description: 'The eternal dance of ocean waves against the shore, captured at Ocean Beach during a spectacular sunset.',
    imageUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'epic',
    location: {
      lat: 37.8044,
      lng: -122.4679,
      address: 'Ocean Beach, San Francisco, CA',
      shopName: 'Seaside Bistro',
    },
    rarity: 87,
    claimedBy: 67,
    timeLeft: '1d 5h',
    rewards: ['Seaside dining discount', '350 XP', 'Beach photography tips', 'Sunset notification alerts'],
    attributes: [
      { trait_type: 'Location', value: 'Ocean Beach', rarity: 76 },
      { trait_type: 'Wave Height', value: 'Medium', rarity: 54 },
      { trait_type: 'Time', value: 'Sunset', rarity: 78 },
      { trait_type: 'Tide', value: 'High', rarity: 43 },
      { trait_type: 'Wind', value: 'Moderate', rarity: 67 },
    ],
    creator: 'Nature Photographers',
    isCollected: false,
    views: 1567,
    likes: 123,
    price: 0.3,
    estimatedValue: 0.8,
    distance: 2.1,
    difficulty: 'hard',
    experience: 350,
    tags: ['ocean', 'waves', 'sunset', 'nature', 'peaceful'],
    story: 'This NFT captures the raw power and beauty of the Pacific Ocean as it meets the California coast, a timeless scene that has inspired countless artists.',
    tips: [
      'Check tide schedules for best wave viewing',
      'Bring warm clothes - ocean breeze is cold',
      'Best photography light is 1 hour before sunset',
      'Watch for surfers - they know the best spots'
    ],
  },
};

const categoryColors = {
  common: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB', gradient: ['#F9FAFB', '#F3F4F6'] },
  rare: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD', gradient: ['#EBF8FF', '#DBEAFE'] },
  epic: { bg: '#EDE9FE', text: '#7C3AED', border: '#C4B5FD', gradient: ['#F5F3FF', '#EDE9FE'] },
  legendary: { bg: '#FEF3C7', text: '#D97706', border: '#FCD34D', gradient: ['#FFFBEB', '#FEF3C7'] },
};

const difficultyColors = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

export default function NFTDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nft, setNft] = useState<NFTDetail | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'attributes' | 'story' | 'tips'>('details');

  useEffect(() => {
    if (id && mockNFTDetails[id]) {
      setNft(mockNFTDetails[id]);
    }
  }, [id]);

  if (!nft) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingSpinner} />
          <Text style={styles.loadingText}>Loading NFT details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing NFT: ${nft.name} - ${nft.description}`,
        title: nft.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleNavigate = () => {
    router.push({
      pathname: '/(tabs)/map',
      params: { nftId: nft.id }
    });
  };

  const handleClaim = () => {
    if (nft.isCollected) {
      Alert.alert('Already Collected', 'You have already collected this NFT!');
    } else {
      Alert.alert(
        'Claim NFT',
        `To claim "${nft.name}", you need to visit ${nft.location.shopName} and scan the QR code.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Navigate There', onPress: handleNavigate },
        ]
      );
    }
  };

  const handleViewOnExplorer = () => {
    if (nft.mintAddress) {
      Alert.alert('View on Explorer', `Mint Address: ${nft.mintAddress}`);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={[styles.actionButton, isLiked && styles.likedButton]} 
          onPress={() => setIsLiked(!isLiked)}
        >
          <Heart size={20} color={isLiked ? "#EF4444" : "#FFFFFF"} fill={isLiked ? "#EF4444" : "none"} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, isBookmarked && styles.bookmarkedButton]} 
          onPress={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark size={20} color={isBookmarked ? "#F59E0B" : "#FFFFFF"} fill={isBookmarked ? "#F59E0B" : "none"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderImageSection = () => (
    <View style={styles.imageSection}>
      <Image source={{ uri: nft.imageUrl }} style={styles.nftImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.imageGradient}
      >
        <View style={styles.imageOverlay}>
          <View style={styles.badgeContainer}>
            <LinearGradient
              colors={categoryColors[nft.category].gradient}
              style={styles.categoryBadge}
            >
              <Text style={[styles.categoryText, { color: categoryColors[nft.category].text }]}>
                {nft.category.toUpperCase()}
              </Text>
            </LinearGradient>
            {nft.timeLeft && (
              <View style={styles.timeLeftBadge}>
                <Clock size={12} color="#EF4444" />
                <Text style={styles.timeLeftText}>{nft.timeLeft}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.imageStats}>
            <View style={styles.statItem}>
              <Star size={16} color="#F59E0B" />
              <Text style={styles.statText}>{nft.rarity}% rare</Text>
            </View>
            <View style={styles.statItem}>
              <Users size={16} color="#FFFFFF" />
              <Text style={styles.statText}>{nft.claimedBy} collected</Text>
            </View>
            <View style={styles.statItem}>
              <Eye size={16} color="#FFFFFF" />
              <Text style={styles.statText}>{nft.views} views</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderInfoSection = () => (
    <View style={styles.infoSection}>
      <View style={styles.titleRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.nftTitle}>{nft.name}</Text>
          <Text style={styles.nftCreator}>Created by {nft.creator}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Value</Text>
          <Text style={styles.priceValue}>{nft.estimatedValue} SOL</Text>
        </View>
      </View>
      
      <View style={styles.locationInfo}>
        <MapPin size={16} color="#F59E0B" />
        <View style={styles.locationText}>
          <Text style={styles.shopName}>{nft.location.shopName}</Text>
          <Text style={styles.address}>{nft.location.address}</Text>
        </View>
        {nft.distance && (
          <Text style={styles.distance}>{nft.distance} km away</Text>
        )}
      </View>

      <View style={styles.quickStats}>
        <View style={styles.quickStatItem}>
          <Zap size={16} color="#F59E0B" />
          <Text style={styles.quickStatText}>{nft.experience} XP</Text>
        </View>
        <View style={styles.quickStatItem}>
          <Trophy size={16} color={difficultyColors[nft.difficulty]} />
          <Text style={[styles.quickStatText, { color: difficultyColors[nft.difficulty] }]}>
            {nft.difficulty}
          </Text>
        </View>
        <View style={styles.quickStatItem}>
          <Heart size={16} color="#EF4444" />
          <Text style={styles.quickStatText}>{nft.likes} likes</Text>
        </View>
      </View>

      <View style={styles.tagsContainer}>
        {nft.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTabNavigation = () => (
    <View style={styles.tabNavigation}>
      {(['details', 'attributes', 'story', 'tips'] as const).map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.description}>{nft.description}</Text>
            
            {nft.isCollected && (
              <View style={styles.collectionInfo}>
                <Calendar size={16} color="#10B981" />
                <Text style={styles.collectionText}>
                  Collected on {nft.collectionDate}
                </Text>
              </View>
            )}
          </View>
        );
      
      case 'attributes':
        return (
          <View style={styles.tabContent}>
            <View style={styles.attributesGrid}>
              {nft.attributes.map((attr, index) => (
                <View key={index} style={styles.attributeItem}>
                  <Text style={styles.attributeType}>{attr.trait_type}</Text>
                  <Text style={styles.attributeValue}>{attr.value}</Text>
                  {attr.rarity && (
                    <View style={styles.rarityIndicator}>
                      <Text style={styles.rarityText}>{attr.rarity}% have this</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        );
      
      case 'story':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.storyText}>{nft.story}</Text>
          </View>
        );
      
      case 'tips':
        return (
          <View style={styles.tabContent}>
            {nft.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        );
      
      default:
        return null;
    }
  };

  const renderRewards = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Rewards & Benefits</Text>
      <View style={styles.rewardsList}>
        {nft.rewards.map((reward, index) => (
          <View key={index} style={styles.rewardItem}>
            <Gift size={16} color="#F59E0B" />
            <Text style={styles.rewardText}>{reward}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
        <Navigation size={20} color="#FFFFFF" />
        <Text style={styles.navigateButtonText}>Navigate</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.claimButton, nft.isCollected && styles.collectedButton]} 
        onPress={handleClaim}
      >
        <Camera size={20} color="#FFFFFF" />
        <Text style={[styles.claimButtonText, nft.isCollected && styles.collectedButtonText]}>
          {nft.isCollected ? 'Collected' : 'Claim NFT'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        {renderHeader()}

        {/* Image Section */}
        {renderImageSection()}

        {/* Info Section */}
        {renderInfoSection()}

        {/* Tab Navigation */}
        {renderTabNavigation()}

        {/* Tab Content */}
        {renderTabContent()}

        {/* Rewards */}
        {renderRewards()}

        {/* Blockchain Info */}
        {nft.mintAddress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Blockchain Details</Text>
            <TouchableOpacity style={styles.blockchainInfo} onPress={handleViewOnExplorer}>
              <View style={styles.blockchainText}>
                <Text style={styles.blockchainLabel}>Mint Address</Text>
                <Text style={styles.blockchainValue} numberOfLines={1}>
                  {nft.mintAddress}
                </Text>
              </View>
              <ExternalLink size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        {renderActionButtons()}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#F3F4F6',
    borderTopColor: '#F59E0B',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likedButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  bookmarkedButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  imageSection: {
    height: 400,
    position: 'relative',
  },
  nftImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  imageOverlay: {
    padding: 20,
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
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
  imageStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 6,
    fontWeight: '600',
  },
  infoSection: {
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  nftTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  nftCreator: {
    fontSize: 16,
    color: '#6B7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
  },
  locationText: {
    marginLeft: 8,
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  distance: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  quickStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStatText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  tabNavigation: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#F59E0B',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  tabContent: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  collectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
  },
  collectionText: {
    fontSize: 14,
    color: '#047857',
    marginLeft: 8,
    fontWeight: '500',
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  attributeItem: {
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: (width - 60) / 2,
  },
  attributeType: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  attributeValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 4,
  },
  rarityIndicator: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  rarityText: {
    fontSize: 10,
    color: '#1E40AF',
    fontWeight: '500',
  },
  storyText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  tipNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  rewardsList: {
    gap: 12,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  rewardText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 8,
    fontWeight: '500',
  },
  blockchainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  blockchainText: {
    flex: 1,
  },
  blockchainLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  blockchainValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6B7280',
    paddingVertical: 16,
    borderRadius: 16,
  },
  navigateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  claimButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    borderRadius: 16,
  },
  collectedButton: {
    backgroundColor: '#10B981',
  },
  claimButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  collectedButtonText: {
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 20,
  },
});