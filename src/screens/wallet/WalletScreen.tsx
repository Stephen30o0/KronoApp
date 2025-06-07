import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  ScrollView,
  Platform,
  Image
} from 'react-native';
import Logo from '../../components/common/Logo';
import { COLORS, FONTS } from '../../constants/theme';

const TRANSACTIONS = [
  {
    id: '1',
    type: 'Received',
    amount: '50',
    token: 'KLT',
    from: 'KronoLabs Rewards',
    date: '2 days ago',
    status: 'Completed',
    description: 'Sign-up bonus'
  },
  {
    id: '2',
    type: 'Staked',
    amount: '25',
    token: 'KLT',
    to: 'Voting Pool',
    date: '1 week ago',
    status: 'Completed',
    description: 'Staking rewards'
  },
  {
    id: '3',
    type: 'Purchase',
    amount: '15',
    token: 'KLT',
    to: 'Comic Store',
    date: '3 days ago',
    status: 'Completed',
    description: 'Quantum Detectives #5'
  },
  {
    id: '4',
    type: 'Reward',
    amount: '5',
    token: 'KLT',
    from: 'Creator Fund',
    date: 'Today',
    status: 'Pending',
    description: 'Content engagement'
  }
];

const COLLECTIBLES = [
  {
    id: '1',
    name: 'Quantum Hero #42',
    type: 'Comic NFT',
    rarity: 'Rare',
    imageUrl: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    creator: 'quantum_ink',
    acquired: '2 weeks ago'
  },
  {
    id: '2',
    name: 'Galactic Explorer Badge',
    type: 'Achievement NFT',
    rarity: 'Common',
    imageUrl: 'https://images.unsplash.com/photo-1601513445506-2ab0d4fb4229?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    creator: 'KronoLabs',
    acquired: '1 month ago'
  },
  {
    id: '3',
    name: 'Neon Dreams Art Piece',
    type: 'Digital Art NFT',
    rarity: 'Epic',
    imageUrl: 'https://images.unsplash.com/photo-1633621412960-6df85eff8c85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    creator: 'neon_artist',
    acquired: '3 days ago'
  }
];

const WalletScreen = () => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer}>
          <Ionicons name="menu-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Balance Card */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <View style={styles.tokenLogoContainer}>
              <Logo size={30} style={styles.tokenLogo} />
              <Text style={styles.tokenName}>KronoLabs</Text>
            </View>
          </View>
          <Text style={styles.balanceAmount}>50 KLT</Text>
          <Text style={styles.balanceFiat}>≈ $25.00 USD</Text>
          
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonInner}>
                <Ionicons name="arrow-down-outline" size={20} color={COLORS.textPrimary} />
                <Text style={styles.actionButtonText}>Receive</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonInner}>
                <Ionicons name="arrow-up-outline" size={20} color={COLORS.textPrimary} />
                <Text style={styles.actionButtonText}>Send</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionButtonInner}>
                <Ionicons name="swap-horizontal-outline" size={20} color={COLORS.textPrimary} />
                <Text style={styles.actionButtonText}>Swap</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        {/* Staking Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Staking</Text>
          <View style={styles.stakingCard}>
            <View style={styles.stakingInfo}>
              <Text style={styles.stakingTitle}>Voting Power</Text>
              <Text style={styles.stakingAmount}>25 KLT</Text>
              <Text style={styles.stakingDesc}>Staked in TownSquare Voting Pool</Text>
            </View>
            <TouchableOpacity style={styles.stakingButton}>
              <Text style={styles.stakingButtonText}>Manage</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* NFT Collectibles Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>NFT Collectibles</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.collectiblesContainer}
          >
            {COLLECTIBLES.map(collectible => (
              <TouchableOpacity key={collectible.id} style={styles.collectibleCard}>
                <View style={styles.collectibleImageContainer}>
                  <Image 
                    source={{ uri: collectible.imageUrl }} 
                    style={styles.collectibleImage} 
                  />
                  <View style={styles.collectibleRarityTag}>
                    <Text style={styles.collectibleRarityText}>{collectible.rarity}</Text>
                  </View>
                </View>
                <View style={styles.collectibleInfo}>
                  <Text style={styles.collectibleName} numberOfLines={1}>{collectible.name}</Text>
                  <Text style={styles.collectibleType}>{collectible.type}</Text>
                  <Text style={styles.collectibleCreator}>By {collectible.creator}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Transactions Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {TRANSACTIONS.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIconContainer}>
                <Ionicons 
                  name={
                    transaction.type === 'Received' ? 'arrow-down-outline' : 
                    transaction.type === 'Staked' ? 'lock-closed-outline' :
                    transaction.type === 'Purchase' ? 'cart-outline' :
                    'star-outline'
                  } 
                  size={20} 
                  color={
                    transaction.type === 'Received' || transaction.type === 'Reward' ? COLORS.success : 
                    transaction.type === 'Staked' ? COLORS.accent1 :
                    COLORS.secondary
                  } 
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.type}</Text>
                <Text style={styles.transactionSubtitle}>
                  {transaction.from ? `From ${transaction.from}` : `To ${transaction.to}`}
                </Text>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.transactionAmountText,
                  {color: 
                    transaction.type === 'Received' || transaction.type === 'Reward' ? COLORS.success : 
                    transaction.type === 'Staked' ? COLORS.accent1 :
                    COLORS.secondary
                  }
                ]}>
                  {transaction.type === 'Received' || transaction.type === 'Reward' ? '+' : '-'}{transaction.amount} {transaction.token}
                </Text>
                <View style={[styles.statusBadge, {backgroundColor: transaction.status === 'Completed' ? COLORS.success : COLORS.warning}]} />
                <Text style={styles.transactionStatus}>{transaction.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 48 : StatusBar.currentHeight! + 12,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  balanceTitle: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    opacity: 0.8,
  },
  tokenLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenLogo: {
    width: 30,
    height: 15,
    marginRight: 5,
  },
  tokenName: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  balanceAmount: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  balanceFiat: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    opacity: 0.8,
    marginBottom: 20,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 10,
  },
  actionButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
    marginLeft: 5,
  },
  sectionContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  viewAllButton: {
    padding: 4,
  },
  viewAllText: {
    ...FONTS.body2,
    color: COLORS.primary,
  },
  collectiblesContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  collectibleCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  collectibleImageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  collectibleImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  collectibleRarityTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  collectibleRarityText: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    fontSize: 10,
  },
  collectibleInfo: {
    padding: 12,
  },
  collectibleName: {
    ...FONTS.body1,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    fontSize: 14,
    marginBottom: 4,
  },
  collectibleType: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  collectibleCreator: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
    fontSize: 10,
  },
  stakingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stakingInfo: {
    flex: 1,
  },
  stakingTitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  stakingAmount: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  stakingDesc: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  stakingButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  stakingButtonText: {
    ...FONTS.body2,
    color: COLORS.textPrimary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    ...FONTS.medium,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  transactionSubtitle: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 2,
    fontSize: 12,
  },
  transactionDescription: {
    ...FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 2,
    fontSize: 11,
  },
  transactionDate: {
    ...FONTS.caption,
    color: COLORS.textTertiary,
    fontSize: 10,
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    ...FONTS.body2,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionStatus: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
});

export default WalletScreen;
