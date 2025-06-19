import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../../components/common/Logo';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import KronoCard from '../../components/wallet/KronoCard';
import AddFundsModal from '../../components/wallet/AddFundsModal';
import SendModal from '../../components/wallet/SendModal';
import ReceiveModal from '../../components/wallet/ReceiveModal';

// Define a type for transaction items for type safety
type Transaction = {
  id: string;
  type: 'receive' | 'send' | 'add';
  title: string;
  amount: string;
  date: string;
};

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    title: 'From KronoLabs Rewards',
    amount: '+ 50.00 KLT',
    date: 'June 12, 2025',
  },
  {
    id: '2',
    type: 'send',
    title: 'To Comic Store',
    amount: '- 15.00 KLT',
    date: 'June 11, 2025',
  },
  {
    id: '3',
    type: 'add',
    title: 'Added Funds',
    amount: '+ 100.00 KLT',
    date: 'June 10, 2025',
  },
  {
    id: '4',
    type: 'send',
    title: 'To @QuantumInk',
    amount: '- 25.00 KLT',
    date: 'June 9, 2025',
  },
];

const WalletScreen = () => {
  const navigation = useNavigation();
  const [isAddFundsVisible, setAddFundsVisible] = useState(false);
  const [isSendVisible, setSendVisible] = useState(false);
  const [isReceiveVisible, setReceiveVisible] = useState(false);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={openDrawer} style={styles.headerLogo}>
        <Logo size={36} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Wallet</Text>
      <TouchableOpacity>
        <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
    </View>
  );

  const renderBalanceCard = () => (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>110.00 KLT</Text>
      <Text style={styles.balanceFiat}>≈ $55.00 USD</Text>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={() => setSendVisible(true)}>
        <View style={styles.actionIconContainer}>
          <Ionicons name="arrow-up" size={24} color={COLORS.textPrimary} />
        </View>
        <Text style={styles.actionText}>Send</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => setReceiveVisible(true)}>
        <View style={styles.actionIconContainer}>
          <Ionicons name="arrow-down" size={24} color={COLORS.textPrimary} />
        </View>
        <Text style={styles.actionText}>Receive</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => setAddFundsVisible(true)}>
        <View style={styles.actionIconContainer}>
          <Ionicons name="add" size={24} color={COLORS.textPrimary} />
        </View>
        <Text style={styles.actionText}>Add Funds</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isPositive = item.type === 'receive' || item.type === 'add';
    return (
      <View style={styles.transactionItem}>
        <View style={[styles.transactionIcon, { backgroundColor: isPositive ? COLORS.success : COLORS.accent1 }]}>
          <Ionicons 
            name={item.type === 'send' ? 'arrow-up' : 'arrow-down'} 
            size={20} 
            color={COLORS.background} 
          />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: isPositive ? COLORS.success : COLORS.textPrimary }]}>
          {item.amount}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <KronoCard />
        {renderBalanceCard()}
        {renderQuickActions()}
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={mockTransactions}
          renderItem={renderTransactionItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false} // Disable FlatList scrolling within ScrollView
        />
      </ScrollView>

      <AddFundsModal isVisible={isAddFundsVisible} onClose={() => setAddFundsVisible(false)} />
      <SendModal isVisible={isSendVisible} onClose={() => setSendVisible(false)} />
      <ReceiveModal isVisible={isReceiveVisible} onClose={() => setReceiveVisible(false)} />
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
  },
  headerLogo: {
    padding: SIZES.small,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  scrollViewContent: {
    padding: SIZES.medium,
  },
  balanceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.large,
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  balanceLabel: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  balanceAmount: {
    ...FONTS.h1,
    color: COLORS.textPrimary,
    marginVertical: SIZES.base,
  },
  balanceFiat: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SIZES.large,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconContainer: {
    backgroundColor: COLORS.surface,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  actionText: {
    ...FONTS.body3,
    color: COLORS.textPrimary,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
  },
  viewAllText: {
    ...FONTS.body3,
    color: COLORS.primary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMedium,
    padding: SIZES.medium,
    marginBottom: SIZES.small,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
  },
  transactionDate: {
    ...FONTS.body3,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    ...FONTS.h4,
  },
});

export default WalletScreen;
