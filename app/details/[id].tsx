import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/store';
import { addFavorite, removeFavorite } from '../../src/store/favoritesSlice';
import { exercisesApi } from '../../src/services/api';
import { storage } from '../../src/utils/storage';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../src/utils/useTheme';

export default function ExerciseDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isFavorite = favorites.some(item => item.id === id);

  useEffect(() => {
    loadExerciseDetails();
  }, [id]);

  const loadExerciseDetails = async () => {
    try {
      const data = await exercisesApi.getExerciseById(id as string);
      setExercise(data);
    } catch (error) {
      console.error('Error loading exercise details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      dispatch(removeFavorite(id as string));
      const updatedFavorites = favorites.filter(item => item.id !== id);
      await storage.saveFavorites(updatedFavorites);
    } else {
      const favoriteItem = {
        id: exercise.id,
        name: exercise.name,
        gifUrl: exercise.gifUrl,
        target: exercise.target,
        bodyPart: exercise.bodyPart,
        equipment: exercise.equipment,
      };
      dispatch(addFavorite(favoriteItem));
      await storage.saveFavorites([...favorites, favoriteItem]);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!exercise) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>Exercise not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Image 
        source={{ uri: exercise.gifUrl }} 
        style={styles.image}
        contentFit="contain"
      />
      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: colors.text }]}>{exercise.name}</Text>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
            <Feather 
              name="heart" 
              size={28} 
              color={isFavorite ? "#F44336" : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoCards}>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Feather name="target" size={24} color="#4CAF50" />
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Target</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{exercise.target}</Text>
          </View>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Feather name="package" size={24} color="#FF9800" />
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Equipment</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{exercise.equipment}</Text>
          </View>
          
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Feather name="activity" size={24} color="#2196F3" />
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Body Part</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{exercise.bodyPart}</Text>
          </View>
        </View>

        {exercise.rating && (
          <View style={[styles.ratingSection, { backgroundColor: colors.card }]}>
            <Feather name="star" size={20} color="#FFC107" />
            <Text style={[styles.ratingText, { color: colors.text }]}>{exercise.rating} / 5</Text>
          </View>
        )}

        <View style={[styles.descriptionSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            {exercise.description || 'This is a great exercise to improve your fitness and target specific muscle groups.'}
          </Text>
        </View>

        <View style={[styles.tipsSection, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tips</Text>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={16} color="#4CAF50" />
            <Text style={[styles.tipText, { color: colors.text }]}>Maintain proper form throughout the exercise</Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={16} color="#4CAF50" />
            <Text style={[styles.tipText, { color: colors.text }]}>Start with lighter weights and gradually increase</Text>
          </View>
          <View style={styles.tipItem}>
            <Feather name="check-circle" size={16} color="#4CAF50" />
            <Text style={[styles.tipText, { color: colors.text }]}>Breathe properly during each repetition</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push(`/workout/${exercise.id}`)}
        >
          <Feather name="play-circle" size={24} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 16,
    color: '#757575',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  content: {
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    textTransform: 'capitalize',
  },
  favoriteButton: {
    padding: 8,
  },
  infoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '31%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 4,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 8,
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 22,
  },
  tipsSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    marginLeft: 8,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#4FC3F7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
