import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

const WatchPartyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'WatchParty'>>();
  const { streamTitle } = route.params;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Watch Party</Text>
            <Text style={styles.headerSubtitle}>{streamTitle}</Text>
        </View>
        <TouchableOpacity style={styles.backButton}>
            <Ionicons name="ellipsis-vertical" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        <Text style={styles.videoPlaceholderText}>Video Player Area</Text>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.chatContainer}>
            <ScrollView style={styles.chatMessages}>
                {/* Mock Chat Messages */}
                <Text style={styles.chatMessage}><Text style={{fontWeight: 'bold'}}>Alice:</Text> This movie is amazing!</Text>
                <Text style={styles.chatMessage}><Text style={{fontWeight: 'bold'}}>Bob:</Text> Totally agree! That last scene was intense.</Text>
                <Text style={styles.chatMessage}><Text style={{fontWeight: 'bold'}}>You:</Text> I know, right?!</Text>
            </ScrollView>
            <View style={styles.chatInputContainer}>
                <TextInput 
                    style={styles.chatInput} 
                    placeholder="Say something..."
                    placeholderTextColor={COLORS.textSecondary}
                />
                <TouchableOpacity>
                    <Ionicons name="send" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  backButton: {
    padding: SIZES.small,
  },
  headerTitleContainer: {
      alignItems: 'center',
  },
  headerTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
      ...FONTS.body3,
      color: COLORS.textSecondary,
  },
  videoContainer: {
    height: 220,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholderText: {
      color: COLORS.textSecondary,
      ...FONTS.h4,
  },
  mainContent: {
      flex: 1,
  },
  chatContainer: {
      flex: 1,
      padding: SIZES.medium,
  },
  chatMessages: {
      flex: 1,
      marginBottom: SIZES.medium,
  },
  chatMessage: {
      ...FONTS.body3,
      color: COLORS.textPrimary,
      marginBottom: SIZES.small,
  },
  chatInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SIZES.small,
      backgroundColor: COLORS.surface,
      borderRadius: SIZES.radiusMedium,
  },
  chatInput: {
      flex: 1,
      ...FONTS.body3,
      color: COLORS.textPrimary,
      marginRight: SIZES.small,
  }
});

export default WatchPartyScreen;
