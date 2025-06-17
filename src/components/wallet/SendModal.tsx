import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type SendModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const SendModal = ({ isVisible, onClose }: SendModalProps) => {
  const [address, setAddress] = useState('');

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    setAddress(text);
  };

  const handleSend = () => {
    if (address.trim() === '') {
      Alert.alert('Error', 'Please enter a valid address.');
      return;
    }
    Alert.alert('Success', `Funds sent to ${address}`);
    onClose();
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
        <Text style={styles.title}>Send KLT</Text>
        <Text style={styles.subtitle}>Enter the recipient's wallet address below.</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Recipient Address"
            placeholderTextColor={COLORS.textSecondary}
            value={address}
            onChangeText={setAddress}
          />
          <TouchableOpacity onPress={handlePaste} style={styles.pasteButton}>
            <Text style={styles.pasteButtonText}>Paste</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  input: {
    flex: 1,
    padding: SIZES.medium,
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  pasteButton: {
    paddingHorizontal: SIZES.medium,
  },
  pasteButtonText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusMedium,
    alignItems: 'center',
    marginTop: SIZES.medium,
  },
  buttonText: {
    ...FONTS.h4,
    color: COLORS.background,
  },
});

export default SendModal;
