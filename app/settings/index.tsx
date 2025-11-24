// filepath: /Users/nimeshmadhusanka/Desktop/fit_buddy/fitbuddy/app/settings/index.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, 

TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../src/utils/useTheme';
import { toggleTheme } from '../../src/store/themeSlice';
import { storage } from '../../src/utils/storage';

export default function SettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors, isDarkMode } = useTheme();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState('metric'); // metric or imperial

  const handleToggleDarkMode = async () => {
    dispatch(toggleTheme());
    await storage.saveDarkMode(!isDarkMode);
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully!');
          },
        },
      ]
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will delete all your workout history. This action cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Progress reset successfully!');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Your data has been exported to your device storage.');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Appearance Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Appearance</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name={isDarkMode ? "moon" : "sun"} size={20} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleToggleDarkMode}
            trackColor={{ false: '#E0E0E0', true: '#4FC3F7' }}
            thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name="droplet" size={20} color="#2196F3" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>App Theme</Text>
          </View>
          <View style={styles.themePicker}>
            <Text style={[styles.themeText, { color: colors.textSecondary }]}>Cyan Blue</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Notifications</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name="bell" size={20} color="#FF9800" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E0E0E0', true: '#4FC3F7' }}
            thumbColor={notificationsEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name="volume-2" size={20} color="#9C27B0" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Sound</Text>
          </View>
          <Switch
            value={soundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#E0E0E0', true: '#4FC3F7' }}
            thumbColor={soundEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name="smartphone" size={20} color="#FF5722" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Vibration</Text>
          </View>
          <Switch
            value={vibrationEnabled}
            onValueChange={setVibrationEnabled}
            trackColor={{ false: '#E0E0E0', true: '#4FC3F7' }}
            thumbColor={vibrationEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Workout Preferences */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Workout Preferences</Text>
        
        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name="activity" size={20} color="#4CAF50" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Measurement Unit</Text>
          </View>
          <View style={styles.unitPicker}>
            <TouchableOpacity
              style={[styles.unitButton, selectedUnit === 'metric' && styles.unitButtonActive]}
              onPress={() => setSelectedUnit('metric')}
            >
              <Text style={[styles.unitButtonText, selectedUnit === 'metric' && styles.unitButtonTextActive]}>
                Metric
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, selectedUnit === 'imperial' && styles.unitButtonActive]}
              onPress={() => setSelectedUnit('imperial')}
            >
              <Text style={[styles.unitButtonText, selectedUnit === 'imperial' && styles.unitButtonTextActive]}>
                Imperial
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name="clock" size={20} color="#673AB7" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Rest Timer</Text>
          </View>
          <View style={styles.themePicker}>
            <Text style={[styles.themeText, { color: colors.textSecondary }]}>60 seconds</Text>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
        </View>

        <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name="refresh-cw" size={20} color="#00BCD4" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Auto-Sync</Text>
          </View>
          <Switch
            value={autoSyncEnabled}
            onValueChange={setAutoSyncEnabled}
            trackColor={{ false: '#E0E0E0', true: '#4FC3F7' }}
            thumbColor={autoSyncEnabled ? '#FFFFFF' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Data & Privacy */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data & Privacy</Text>
        
        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={handleExportData}
        >
          <View style={styles.settingLeft}>
            <Feather name="download" size={20} color="#4CAF50" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Export Data</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={handleClearCache}
        >
          <View style={styles.settingLeft}>
            <Feather name="trash-2" size={20} color="#FF9800" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Clear Cache</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.settingItem, { borderBottomColor: colors.border }]}
          onPress={handleResetProgress}
        >
          <View style={styles.settingLeft}>
            <Feather name="alert-triangle" size={20} color="#F44336" />
            <Text style={[styles.settingLabel, { color: '#F44336' }]}>Reset Progress</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
        
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name="info" size={20} color="#2196F3" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>App Version</Text>
          </View>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>1.0.0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
          <View style={styles.settingLeft}>
            <Feather name="file-text" size={20} color="#607D8B" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Terms of Service</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: 'transparent' }]}>
          <View style={styles.settingLeft}>
            <Feather name="shield" size={20} color="#795548" />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Policy</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          GymBuddy - Your Fitness Companion
        </Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          © 2025 All rights reserved
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 60,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  themePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeText: {
    fontSize: 14,
  },
  unitPicker: {
    flexDirection: 'row',
    gap: 8,
  },
  unitButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  unitButtonActive: {
    backgroundColor: '#4FC3F7',
    borderColor: '#4FC3F7',
  },
  unitButtonText: {
    fontSize: 14,
    color: '#757575',
  },
  unitButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
  },
});
