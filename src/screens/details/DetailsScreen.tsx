import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, FONTS, SIZES } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/types';

const { width, height } = Dimensions.get('window');

// --- Mock Data ---
const mockStreamDetails = {
  id: 's1-0',
  title: 'The Recruit',
  trailerUrl: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
  year: 2022,
  maturityRating: '16+',
  description: 'Thrown into the deep end during his first week at the CIA, rookie lawyer Owen Hendricks gets in over his head when he uncovers a possible threat.',
  cast: ['Noah Centineo', 'Laura Haddock', 'Colton Dunn'],
  creator: 'Alexi Hawley',
  seasons: [
    {
      season: 1,
      episodes: [
        { id: 's1e1', title: 'I.N.A.S.I.A.L.', duration: '57m', description: 'After a former asset threatens to expose agency secrets, Owen is tasked with finding a loophole in her case before she reveals classified information.' },
        { id: 's1e2', title: 'N.L.T.S.Y.P.', duration: '52m', description: 'Owen\'s mission takes an unexpected turn, forcing him to navigate a dangerous web of international espionage.' },
        { id: 's1e3', title: 'Y.D.E.K.W.Y.D.', duration: '54m', description: 'While scrambling to learn how to navigate the high-stakes world of international espionage, Owen gets to work on the case.' },
      ],
    },
    {
      season: 2,
      episodes: [
        { id: 's2e1', title: 'The Ci-Kill', duration: '55m', description: 'Description for Season 2, Episode 1.' },
        { id: 's2e2', title: 'Who\'s The Mole', duration: '58m', description: 'Description for Season 2, Episode 2.' },
      ],
    },
  ],
};

// --- Component ---
const DetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Details'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { streamId } = route.params;
  const videoRef = useRef<Video>(null);
  const [selectedSeason, setSelectedSeason] = React.useState(mockStreamDetails.seasons[0]);
  const [isSeasonPickerVisible, setSeasonPickerVisible] = React.useState(false);

  const handleSelectEpisode = (episode: any) => {
    console.log(`Playing Season ${selectedSeason.season}, Episode: ${episode.title}`);
    // TODO: Navigate to a video player screen
  };

  // In a real app, you'd fetch this data based on streamId
  const stream = mockStreamDetails;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: stream.trailerUrl }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{stream.title}</Text>
          <View style={styles.metaDataContainer}>
            <Text style={styles.metaText}>{stream.year}</Text>
            <Text style={styles.maturityRating}>{stream.maturityRating}</Text>
            <Text style={styles.metaText}>{stream.seasons.length} Seasons</Text>
          </View>

          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={24} color={COLORS.background} />
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="download-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.downloadButtonText}>Download S1:E1</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.watchPartyButton} onPress={() => navigation.navigate('WatchParty', { streamTitle: stream.title })}>
            <Ionicons name="people-outline" size={24} color={COLORS.background} />
            <Text style={styles.watchPartyButtonText}>Start a Watch Party</Text>
          </TouchableOpacity>

          <View style={styles.socialActionsContainer}>
            <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Liked')}>
              <Ionicons name="heart-outline" size={28} color={COLORS.textSecondary} />
              <Text style={styles.socialButtonText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Comment Tapped')}>
              <Ionicons name="chatbubble-outline" size={28} color={COLORS.textSecondary} />
              <Text style={styles.socialButtonText}>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Shared')}>
              <Ionicons name="share-social-outline" size={28} color={COLORS.textSecondary} />
              <Text style={styles.socialButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{stream.description}</Text>
          <Text style={styles.castText}>Cast: {stream.cast.join(', ')}</Text>
          <Text style={styles.castText}>Creator: {stream.creator}</Text>
        </View>

        <View style={styles.sectionSeparator} />

        {/* Season Selector */}
        <TouchableOpacity
          style={styles.seasonSelector}
          onPress={() => setSeasonPickerVisible(!isSeasonPickerVisible)}
        >
          <Text style={styles.seasonSelectorText}>Season {selectedSeason.season}</Text>
          <Ionicons name={isSeasonPickerVisible ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>

        {isSeasonPickerVisible && (
          <View style={styles.seasonPicker}>
            {stream.seasons.map(season => (
              <TouchableOpacity
                key={season.season}
                style={styles.seasonPickerItem}
                onPress={() => {
                  setSelectedSeason(season);
                  setSeasonPickerVisible(false);
                }}
              >
                <Text style={styles.seasonPickerItemText}>Season {season.season}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Episodes List */}
        <View style={styles.episodesContainer}>
          {selectedSeason.episodes.map((episode, index) => (
            <TouchableOpacity key={episode.id} style={styles.episodeItem} onPress={() => handleSelectEpisode(episode)}>
                <View style={styles.episodeLeft}>
                    <Text style={styles.episodeNumber}>{index + 1}</Text>
                </View>
                <View style={styles.episodeCenter}>
                    <Text style={styles.episodeTitle}>{episode.title}</Text>
                    <Text style={styles.episodeDuration}>{episode.duration}</Text>
                </View>
                <View style={styles.episodeRight}>
                    <Ionicons name="download-outline" size={24} color={COLORS.textSecondary} />
                </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  videoContainer: {
    width: width,
    height: height * 0.3,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  backButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      padding: 8,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
  },
  contentContainer: {
    padding: SIZES.large,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
  },
  metaDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  metaText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginRight: 16,
  },
  maturityRating: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 16,
    overflow: 'hidden',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textPrimary,
    borderRadius: SIZES.radiusSmall,
    paddingVertical: 12,
    marginTop: 16,
  },
  playButtonText: {
    ...FONTS.h4,
    color: COLORS.background,
    marginLeft: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSmall,
    paddingVertical: 12,
    marginTop: 12,
  },
  downloadButtonText: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  watchPartyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent1,
    borderRadius: SIZES.radiusSmall,
    paddingVertical: 12,
    marginTop: 12,
  },
  watchPartyButtonText: {
    ...FONTS.h4,
    color: COLORS.background,
    marginLeft: 8,
  },
  description: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
    marginTop: 16,
    lineHeight: 22,
  },
  castText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  socialActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: SIZES.large,
  },
  socialButton: {
    alignItems: 'center',
  },
  socialButtonText: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: COLORS.surface,
    marginVertical: SIZES.large,
  },
  seasonSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SIZES.medium,
    borderRadius: SIZES.radiusSmall,
    marginHorizontal: SIZES.large,
  },
  seasonSelectorText: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
  },
  seasonPicker: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusSmall,
    marginHorizontal: SIZES.large,
    marginTop: 4,
    overflow: 'hidden',
  },
  seasonPickerItem: {
    padding: SIZES.medium,
  },
  seasonPickerItemText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  episodesContainer: {
      paddingHorizontal: SIZES.large,
      paddingBottom: 40,
  },
  episodesTitle: {
      ...FONTS.h2,
      color: COLORS.textPrimary,
      marginBottom: 16,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  episodeLeft: {
    marginRight: SIZES.medium,
  },
  episodeNumber: {
    ...FONTS.h3,
    color: COLORS.textSecondary,
  },
  episodeCenter: {
    flex: 1,
  },
  episodeTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  episodeDuration: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  episodeRight: {
    paddingLeft: SIZES.medium,
  },
});

export default DetailsScreen;
