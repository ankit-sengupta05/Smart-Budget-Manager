import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  RefreshControl, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useAuth } from '../context/AuthContext';
import { getTransactions, summarizeByCategory } from '../utils/transactionStore';

const COLORS = ['#6c63ff','#ff6584','#43e97b','#f7971e','#4facfe','#f093fb','#a8edea','#ffecd2'];
const W = Dimensions.get('window').width;

export default function DashboardScreen() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const txs = await getTransactions(user.uid);
      setTransactions(txs);
    } catch (e) {
      Alert.alert('Error loading transactions', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const summary = summarizeByCategory(transactions);
  const totalSpent = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const now = new Date();
  const monthSpent = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, t) => s + (t.amount || 0), 0);

  const pieData = summary.slice(0, 6).map((item, i) => ({
    name: item.name,
    population: item.total,
    color: COLORS[i % COLORS.length],
    legendFontColor: '#aaa',
    legendFontSize: 11,
  }));

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color="#6c63ff" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => { setRefreshing(true); load(); }}
          tintColor="#6c63ff"
        />
      }
    >
      <Text style={styles.header}>Overview</Text>

      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: '#1a1a3e' }]}>
          <Text style={styles.cardLabel}>Total Spent</Text>
          <Text style={styles.cardValue}>
            ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#1a2e1a' }]}>
          <Text style={styles.cardLabel}>This Month</Text>
          <Text style={[styles.cardValue, { color: '#43e97b' }]}>
            ₹{monthSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </Text>
        </View>
      </View>

      {pieData.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <PieChart
            data={pieData}
            width={W - 32}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              backgroundColor: 'transparent',
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="10"
            absolute
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By Category</Text>
        {summary.map((item, i) => (
          <View key={item.name} style={styles.catRow}>
            <View style={[styles.dot, { backgroundColor: COLORS[i % COLORS.length] }]} />
            <Text style={styles.catName}>{item.name}</Text>
            <Text style={styles.catAmount}>
              ₹{item.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.section, { marginBottom: 40 }]}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.length === 0 && (
          <Text style={styles.empty}>No transactions yet.{'\n'}Go to Import tab to add your first one!</Text>
        )}
        {transactions.slice(0, 15).map((tx, i) => (
          <View key={tx.id || i} style={styles.txRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.txMerchant}>{tx.merchant}</Text>
              <Text style={styles.txMeta}>{tx.category} • {new Date(tx.date).toLocaleDateString('en-IN')}</Text>
            </View>
            <Text style={styles.txAmount}>
              -₹{(tx.amount || 0).toLocaleString('en-IN')}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', padding: 16 },
  header: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 52, marginBottom: 20 },
  cards: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  card: { flex: 1, borderRadius: 16, padding: 18 },
  cardLabel: { color: '#888', fontSize: 12, marginBottom: 6 },
  cardValue: { color: '#fff', fontSize: 20, fontWeight: '800' },
  section: { marginTop: 24 },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 14 },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  catName: { flex: 1, color: '#ccc', fontSize: 14 },
  catAmount: { color: '#fff', fontWeight: '700' },
  txRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#141420', borderRadius: 12, padding: 14, marginBottom: 8,
  },
  txMerchant: { color: '#fff', fontWeight: '600', fontSize: 14 },
  txMeta: { color: '#555', fontSize: 12, marginTop: 2 },
  txAmount: { color: '#ff6584', fontWeight: '700', fontSize: 15 },
  empty: { color: '#555', textAlign: 'center', marginTop: 20, lineHeight: 24 },
});
