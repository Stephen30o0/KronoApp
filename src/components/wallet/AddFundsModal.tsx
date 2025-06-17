import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

type AddFundsModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

const AddFundsModal = ({ isVisible, onClose }: AddFundsModalProps) => {
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
        <Text style={styles.title}>Add Funds</Text>
        <Text style={styles.subtitle}>Enter your card details to add funds to your wallet.</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          placeholderTextColor={COLORS.textSecondary}
          keyboardType="numeric"
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.expiryInput]}
            placeholder="MM/YY"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.cvvInput]}
            placeholder="CVV"
            placeholderTextColor={COLORS.textSecondary}
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Funds</Text>
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
  input: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    ...FONTS.body3,
    color: COLORS.textPrimary,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expiryInput: {
    flex: 1,
    marginRight: SIZES.small,
  },
  cvvInput: {
    flex: 1,
    marginLeft: SIZES.small,
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

export default AddFundsModal;
