import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type ReceiveModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const MOCK_WALLET_ADDRESS = '0x1234...abcd';

const ReceiveModal = ({ isVisible, onClose }: ReceiveModalProps) => {
  const handleCopy = () => {
    Clipboard.setStringAsync(MOCK_WALLET_ADDRESS);
    Alert.alert('Copied!', 'Wallet address copied to clipboard.');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My Krono wallet address: ${MOCK_WALLET_ADDRESS}`,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.7}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-circle" size={30} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Receive KLT</Text>
        <Text style={styles.subtitle}>Share your address to receive funds.</Text>
        
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{MOCK_WALLET_ADDRESS}</Text>
        </View>

        {/* Placeholder for a QR Code */}
        <View style={styles.qrCodePlaceholder}>
          <Ionicons name="qr-code-outline" size={100} color={COLORS.textSecondary} />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.copyButton]} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={20} color={COLORS.primary} />
            <Text style={[styles.buttonText, { color: COLORS.primary, marginLeft: SIZES.small }]}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.shareButton]} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={20} color={COLORS.background} />
            <Text style={[styles.buttonText, { marginLeft: SIZES.small }]}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: COLORS.surface,
    padding: SIZES.large,
    borderTopLeftRadius: SIZES.radiusLarge,
    borderTopRightRadius: SIZES.radiusLarge,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: SIZES.medium,
    right: SIZES.medium,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginBottom: SIZES.large,
  },
  addressContainer: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
    width: '100%',
    alignItems: 'center',
  },
  addressText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  qrCodePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    padding: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SIZES.small,
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    marginLeft: SIZES.small,
  },
  buttonText: {
    ...FONTS.h4,
    color: COLORS.background,
  },
});

export default ReceiveModal;
