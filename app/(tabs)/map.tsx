import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import { Navigation, MapPin, Compass, Target, QrCode, Sparkles, Clock, Star, CircleCheck as CheckCircle, ExternalLink, ChevronDown, Users } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface NFTLocation {
  id: string;
  name: string;
  category: 'common' | 'rare' | 'epic' | 'legendary';
  coordinate: {
    latitude: number;
    longitude: number;
  };
  shopName: string;
  address: string;
  imageUrl: string;
  rarity: number;
  timeLeft?: string;
  distance?: number;
}

const mockNFTLocations: NFTLocation[] = [
  {
    id: '1',
    name: 'Golden Gate Sunset',
    category: 'legendary',
    coordinate: { latitude: 37.8199, longitude: -122.4783 },
    shopName: 'Golden Gate Cafe',
    address: 'Golden Gate Bridge, San Francisco, CA',
    imageUrl: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=400',
    rarity: 95,
    timeLeft: '2h 15m',
  },
  {
    id: '2',
    name: 'Urban Street Art',
    category: 'rare',
    coordinate: { latitude: 37.7749, longitude: -122.4194 },
    shopName: 'Art Corner Gallery',
    address: 'Mission District, San Francisco, CA',
    imageUrl: 'https://images.pexels.com/photos/1646953/pexels-photo-1646953.jpeg?auto=compress&cs=tinysrgb&w=400',
    rarity: 78,
  },
  {
    id: '3',
    name: 'Coffee Shop Vibes',
    category: 'common',
    coordinate: { latitude: 37.7849, longitude: -122.4094 },
    shopName: 'Blue Bottle Coffee',
    address: 'Union Square, San Francisco, CA',
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    rarity: 45,
  },
  {
    id: '4',
    name: 'Ocean Waves',
    category: 'epic',
    coordinate: { latitude: 37.8044, longitude: -122.4679 },
    shopName: 'Seaside Bistro',
    address: 'Ocean Beach, San Francisco, CA',
    imageUrl: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
    rarity: 87,
  },
];

const categoryColors = {
  common: '#9CA3AF',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};

export default function MapScreen() {
  const { nftId } = useLocalSearchParams();
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<NFTLocation | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [nearbyNFT, setNearbyNFT] = useState<NFTLocation | null>(null);
  const [scanning, setScanning] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    
    // If nftId is provided, focus on that NFT
    if (nftId) {
      const nft = mockNFTLocations.find(n => n.id === nftId);
      if (nft) {
        setSelectedNFT(nft);
      }
    }
  }, [nftId]);

  useEffect(() => {
    if (userLocation) {
      checkNearbyNFTs();
      calculateDistances();
    }
  }, [userLocation]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use the map.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
    }
  };

  const calculateDistances = () => {
    if (!userLocation) return;

    const updatedNFTs = mockNFTLocations.map(nft => {
      const distance = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        nft.coordinate.latitude,
        nft.coordinate.longitude
      );
      return { ...nft, distance };
    });

    // Update selected NFT with distance
    if (selectedNFT) {
      const updatedSelected = updatedNFTs.find(nft => nft.id === selectedNFT.id);
      if (updatedSelected) {
        setSelectedNFT(updatedSelected);
      }
    }
  };

  const checkNearbyNFTs = () => {
    if (!userLocation) return;

    const nearby = mockNFTLocations.find(nft => {
      const distance = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        nft.coordinate.latitude,
        nft.coordinate.longitude
      );
      return distance < 0.1; // Within 100 meters
    });

    setNearbyNFT(nearby || null);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleClaimNFT = async () => {
    if (!nearbyNFT && !selectedNFT) return;
    
    setScanning(true);
    setClaiming(true);

    // Simulate claiming process
    setTimeout(() => {
      setScanning(false);
      setClaiming(false);
      setClaimSuccess(true);
      
      Alert.alert(
        'NFT Claimed!',
        'Congratulations! You have successfully claimed your NFT.',
        [
          {
            text: 'View Collection',
            onPress: () => {
              router.replace('/(tabs)/profile');
            },
          },
          {
            text: 'Continue Exploring',
            onPress: () => {
              setClaimSuccess(false);
              router.replace('/(tabs)/index');
            },
          },
        ]
      );
    }, 2000);
  };

  const handleNavigateToNFT = () => {
    if (!selectedNFT || !userLocation) return;
    
    setIsNavigating(true);
    Alert.alert(
      'Navigation',
      `Starting navigation to ${selectedNFT.shopName}`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setIsNavigating(false) },
        { text: 'Open Maps', onPress: () => {
          // Open native maps app
          const url = Platform.select({
            ios: `maps:${selectedNFT.coordinate.latitude},${selectedNFT.coordinate.longitude}`,
            android: `geo:${selectedNFT.coordinate.latitude},${selectedNFT.coordinate.longitude}`,
            web: `https://maps.google.com/maps?q=${selectedNFT.coordinate.latitude},${selectedNFT.coordinate.longitude}`,
          });
          if (url && Platform.OS === 'web') {
            window.open(url, '_blank');
          }
          setIsNavigating(false);
        }},
      ]
    );
  };

  // When no location is available, use default coordinates
  if (!userLocation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <View style={styles.compassContainer}>
              <Compass size={32} color="#F59E0B" />
            </View>
            <Text style={styles.loadingTitle}>Getting your location...</Text>
            <Text style={styles.loadingSubtitle}>Please enable location services</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Map Explorer</Text>
            <Text style={styles.subtitle}>Find and claim location-based NFTs</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton} onPress={getCurrentLocation}>
              <Target size={20} color="#F59E0B" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.push('/(tabs)/discover')}
            >
              <Compass size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <MapPin size={48} color="#F59E0B" />
            <Text style={styles.mapPlaceholderTitle}>Interactive Map</Text>
            <Text style={styles.mapPlaceholderSubtitle}>
              Location: {userLocation.coords.latitude.toFixed(4)}, {userLocation.coords.longitude.toFixed(4)}
            </Text>
            
            {/* NFT Markers Simulation */}
            <View style={styles.markersContainer}>
              {mockNFTLocations.map((nft) => (
                <TouchableOpacity
                  key={nft.id}
                  style={[
                    styles.markerButton,
                    { backgroundColor: categoryColors[nft.category] },
                    selectedNFT?.id === nft.id && styles.selectedMarker
                  ]}
                  onPress={() => setSelectedNFT(nft)}
                >
                  <Sparkles size={16} color="#FFFFFF" />
                  <Text style={styles.markerText}>{nft.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Nearby NFT Alert */}
        {nearbyNFT && (
          <View style={styles.nearbyAlert}>
            <BlurView intensity={80} style={styles.alertBlur}>
              <View style={styles.alertContent}>
                <View style={styles.alertIcon}>
                  <Sparkles size={20} color="#F59E0B" />
                </View>
                <View style={styles.alertText}>
                  <Text style={styles.alertTitle}>NFT Nearby!</Text>
                  <Text style={styles.alertSubtitle}>You can claim "{nearbyNFT.name}"</Text>
                </View>
                <TouchableOpacity style={styles.claimButton} onPress={handleClaimNFT}>
                  <QrCode size={16} color="#FFFFFF" />
                  <Text style={styles.claimButtonText}>Claim</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        )}

        {/* Selected NFT Card */}
        {selectedNFT && (
          <View style={styles.selectedNFTCard}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>{selectedNFT.name}</Text>
                  <Text style={styles.cardSubtitle}>{selectedNFT.shopName}</Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: categoryColors[selectedNFT.category] }]}>
                  <Text style={styles.categoryText}>{selectedNFT.category.toUpperCase()}</Text>
                </View>
              </View>
              
              <View style={styles.cardStats}>
                <View style={styles.statItem}>
                  <Star size={14} color="#F59E0B" />
                  <Text style={styles.statText}>{selectedNFT.rarity}% rare</Text>
                </View>
                {selectedNFT.timeLeft && (
                  <View style={styles.statItem}>
                    <Clock size={14} color="#EF4444" />
                    <Text style={styles.statText}>{selectedNFT.timeLeft} left</Text>
                  </View>
                )}
                {selectedNFT.distance && (
                  <View style={styles.statItem}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.statText}>{selectedNFT.distance.toFixed(1)} km away</Text>
                  </View>
                )}
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={handleNavigateToNFT}
                  disabled={isNavigating}
                >
                  <Navigation size={16} color="#FFFFFF" />
                  <Text style={styles.navigateButtonText}>
                    {isNavigating ? 'Navigating...' : 'Navigate'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => router.push(`/nft/${selectedNFT.id}`)}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Directions Section */}
        {selectedNFT && (
          <TouchableOpacity
            style={styles.directionsToggle}
            onPress={() => setShowDirections(!showDirections)}
          >
            <View style={styles.directionsHeader}>
              <Navigation size={20} color="#F59E0B" />
              <Text style={styles.directionsTitle}>Directions to {selectedNFT.shopName}</Text>
              <ChevronDown 
                size={20} 
                color="#F59E0B" 
                style={[
                  styles.chevron,
                  showDirections && styles.chevronRotated
                ]}
              />
            </View>
          </TouchableOpacity>
        )}

        {showDirections && selectedNFT && (
          <View style={styles.directionsContent}>
            <View style={styles.directionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Head towards {selectedNFT.address}</Text>
            </View>
            <View style={styles.directionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Look for {selectedNFT.shopName}</Text>
            </View>
            <View style={styles.directionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Scan the QR code to claim your NFT</Text>
            </View>
          </View>
        )}

        {/* Claiming Overlay */}
        {claiming && (
          <View style={styles.claimingOverlay}>
            <View style={styles.claimingContent}>
              <View style={styles.claimingIcon}>
                <Sparkles size={32} color="#F59E0B" />
              </View>
              <Text style={styles.claimingTitle}>Claiming NFT</Text>
              <Text style={styles.claimingText}>
                Please wait while we process your claim...
              </Text>
              <View style={styles.loadingBar}>
                <View style={styles.loadingFill} />
              </View>
            </View>
          </View>
        )}

        {/* Success Modal */}
        {claimSuccess && (
          <View style={styles.successOverlay}>
            <View style={styles.successContent}>
              <View style={styles.successIcon}>
                <CheckCircle size={64} color="#10B981" />
              </View>
              <Text style={styles.successTitle}>NFT Claimed Successfully!</Text>
              <Text style={styles.successText}>
                Your NFT has been added to your collection
              </Text>
              <TouchableOpacity
                style={styles.successButton}
                onPress={() => {
                  setClaimSuccess(false);
                  router.push('/(tabs)/profile');
                }}
              >
                <Text style={styles.successButtonText}>View Collection</Text>
              </TouchableOpacity>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingContent: {
    alignItems: 'center',
  },
  compassContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  mapContainer: {
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  mapPlaceholderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  mapPlaceholderSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  markersContainer: {
    marginTop: 20,
    gap: 8,
  },
  markerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  selectedMarker: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  nearbyAlert: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  alertBlur: {
    padding: 16,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  alertSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  claimButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  selectedNFTCard: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B',
    paddingVertical: 12,
    borderRadius: 12,
  },
  navigateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  viewButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  directionsToggle: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  directionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  directionsTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  directionsContent: {
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  directionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stepText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  claimingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimingContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  claimingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  claimingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  claimingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    width: '100%',
    borderRadius: 2,
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  successButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 20,
  },
});