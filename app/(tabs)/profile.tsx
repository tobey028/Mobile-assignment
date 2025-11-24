import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/store';
import { logout } from '../../src/store/authSlice';
import { storage } from '../../src/utils/storage';
import { Feather } from '@expo/vector-icons';
import { toggleTheme } from '../../src/store/themeSlice';
import { useTheme } from '../../src/utils/useTheme';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const { colors, isDarkMode } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await storage.removeToken();
            await storage.removeUser();
            dispatch(logout());
            router.replace('/login');
          },
        },
      ]
    );
  };

  const handleToggleDarkMode = async () => {
    dispatch(toggleTheme());
    await storage.saveDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Feather name="user" size={50} color="#FFFFFF" />
        </View>
        
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.username}>@{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Feather name="activity" size={24} color="#4FC3F7" />
          <Text style={[styles.statValue, { color: colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Workouts</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Feather name="heart" size={24} color="#F44336" />
          <Text style={[styles.statValue, { color: colors.text }]}>{favorites.length}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Favorites</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card }]}>
          <Feather name="zap" size={24} color="#FF9800" />
          <Text style={[styles.statValue, { color: colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
        </View>
      </View>

      <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push('/settings')}
        >
          <Feather name="settings" size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Settings</Text>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={handleToggleDarkMode}
        >
          <Feather name={isDarkMode ? "sun" : "moon"} size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Dark Mode</Text>
          <View style={styles.toggleContainer}>
            <View style={[styles.toggle, isDarkMode && styles.toggleActive]}>
              <View style={[styles.toggleThumb, isDarkMode && styles.toggleThumbActive]} />
            </View>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push('/settings')}
        >
          <Feather name="help-circle" size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>Help & Support</Text>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={() => router.push('/settings')}
        >
          <Feather name="info" size={20} color={colors.text} />
          <Text style={[styles.menuText, { color: colors.text }]}>About</Text>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#FFFFFF" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4FC3F7',
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#81D4FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  username: {
    fontSize: 16,
    color: '#E8F5E9',
    marginTop: 5,
  },
  email: {
    fontSize: 14,
    color: '#E8F5E9',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: -30,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    marginLeft: 12,
  },
  toggleContainer: {
    marginLeft: 'auto',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    padding: 3,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#4FC3F7',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#F44336',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
