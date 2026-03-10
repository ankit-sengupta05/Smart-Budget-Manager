import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Logged in as</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>🔐 Security</Text>
        <Text style={styles.value}>Firebase Auth + Firestore encrypted cloud sync</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📊 Your Data</Text>
        <Text style={styles.value}>All transactions are private to your account and synced securely</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>📱 SMS Parsing</Text>
        <Text style={styles.value}>Supports HDFC, SBI, ICICI, Axis, Kotak and most Indian banks</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0f', padding: 16 },
  header: { fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 52, marginBottom: 24 },
  card: { backgroundColor: '#141420', borderRadius: 14, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: '#1e1e30' },
  label: { color: '#555', fontSize: 12, marginBottom: 6 },
  value: { color: '#fff', fontSize: 14, fontWeight: '500', lineHeight: 20 },
  logoutBtn: {
    backgroundColor: '#1a0a0a', borderRadius: 14, padding: 16,
    alignItems: 'center', marginTop: 16, borderWidth: 1, borderColor: '#ff6584',
  },
  logoutText: { color: '#ff6584', fontWeight: '700', fontSize: 15 },
});
