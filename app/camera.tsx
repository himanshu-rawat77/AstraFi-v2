import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import { X, FlashlightOff as FlashOff, Slash as FlashOn, RotateCcw, QrCode, CircleCheck as CheckCircle, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <QrCode size={64} color="#6B7280" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan QR codes and claim NFTs.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned || scanning) return;
    
    setScanning(true);
    setScanned(true);

    // Simulate NFT claim process
    setTimeout(() => {
      Alert.alert(
        'NFT Claimed!',
        'Congratulations! You have successfully claimed your NFT. It will appear in your collection shortly.',
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
              router.replace('/(tabs)/index');
            },
          },
        ]
      );
    }, 2000);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => !current);
  };

  const handleClose = () => {
    router.back();
  };

  const resetScanner = () => {
    setScanned(false);
    setScanning(false);
  };

  const renderScanningOverlay = () => (
    <View style={styles.scanningOverlay}>
      <BlurView intensity={80} style={styles.scanningBlur}>
        <View style={styles.scanningContent}>
          <View style={styles.scanningIcon}>
            <Sparkles size={32} color="#F59E0B" />
          </View>
          <Text style={styles.scanningTitle}>Processing NFT Claim</Text>
          <Text style={styles.scanningText}>
            Please wait while we verify your location and mint your NFT...
          </Text>
          <View style={styles.loadingBar}>
            <View style={styles.loadingFill} />
          </View>
        </View>
      </BlurView>
    </View>
  );

  const renderScanFrame = () => (
    <View style={styles.scanFrame}>
      <View style={styles.scanCorners}>
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </View>
      <View style={styles.scanLine} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Scan Frame */}
        {!scanned && renderScanFrame()}

        {/* Instructions */}
        {!scanned && (
          <View style={styles.instructions}>
            <BlurView intensity={80} style={styles.instructionsBlur}>
              <QrCode size={24} color="#FFFFFF" />
              <Text style={styles.instructionsText}>
                Point your camera at the QR code to claim your NFT
              </Text>
            </BlurView>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
            {flash ? (
              <FlashOn size={24} color="#FFFFFF" />
            ) : (
              <FlashOff size={24} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
            <RotateCcw size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {scanned && !scanning && (
            <TouchableOpacity style={styles.controlButton} onPress={resetScanner}>
              <Text style={styles.resetText}>Scan Again</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Success Indicator */}
        {scanned && !scanning && (
          <View style={styles.successIndicator}>
            <CheckCircle size={64} color="#10B981" />
            <Text style={styles.successText}>QR Code Detected!</Text>
          </View>
        )}

        {/* Scanning Overlay */}
        {scanning && renderScanningOverlay()}
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 44,
  },
  scanFrame: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    height: 250,
    marginTop: -125,
    marginLeft: -125,
  },
  scanCorners: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#F59E0B',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#F59E0B',
    opacity: 0.8,
  },
  instructions: {
    position: 'absolute',
    bottom: 200,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  instructionsBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  instructionsText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  successIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -50,
    marginLeft: -50,
    alignItems: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 12,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningBlur: {
    margin: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  scanningContent: {
    padding: 40,
    alignItems: 'center',
  },
  scanningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scanningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  scanningText: {
    fontSize: 16,
    color: '#F3F4F6',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    width: '100%',
    borderRadius: 2,
  },
});