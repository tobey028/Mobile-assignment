import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { exercisesApi } from '../../src/services/api';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../src/utils/useTheme';

export default function WorkoutScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [restTime, setRestTime] = useState(60);
  const [currentSet, setCurrentSet] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);

  useEffect(() => {
    loadExerciseDetails();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, timer]);

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

  const handleStartWorkout = () => {
    setIsWorkoutStarted(true);
    setCurrentSet(1);
  };

  const handleCompleteSet = () => {
    if (currentSet < sets) {
      setIsResting(true);
      setTimer(restTime);
      setCurrentSet(currentSet + 1);
    } else {
      handleFinishWorkout();
    }
  };

  const handleSkipRest = () => {
    setIsResting(false);
    setTimer(0);
  };

  const handleFinishWorkout = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#4FC3F7" />
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Workout Session</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.exerciseInfo, { backgroundColor: colors.card }]}>
        <Image 
          source={{ uri: exercise.gifUrl }} 
          style={styles.exerciseImage}
          contentFit="contain"
        />
        <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
        <Text style={[styles.exerciseTarget, { color: colors.textSecondary }]}>
          Target: {exercise.target} • {exercise.bodyPart}
        </Text>
      </View>

      {!isWorkoutStarted ? (
        <View style={styles.setupContainer}>
          <View style={[styles.setupCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.setupTitle, { color: colors.text }]}>Workout Setup</Text>
            
            <View style={styles.setupItem}>
              <Text style={[styles.setupLabel, { color: colors.text }]}>Sets</Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity 
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => setSets(Math.max(1, sets - 1))}
                >
                  <Feather name="minus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: colors.text }]}>{sets}</Text>
                <TouchableOpacity 
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => setSets(sets + 1)}
                >
                  <Feather name="plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.setupItem}>
              <Text style={[styles.setupLabel, { color: colors.text }]}>Reps per Set</Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity 
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => setReps(Math.max(1, reps - 1))}
                >
                  <Feather name="minus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: colors.text }]}>{reps}</Text>
                <TouchableOpacity 
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => setReps(reps + 1)}
                >
                  <Feather name="plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.setupItem}>
              <Text style={[styles.setupLabel, { color: colors.text }]}>Rest Time (sec)</Text>
              <View style={styles.counterButtons}>
                <TouchableOpacity 
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => setRestTime(Math.max(15, restTime - 15))}
                >
                  <Feather name="minus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={[styles.counterValue, { color: colors.text }]}>{restTime}</Text>
                <TouchableOpacity 
                  style={[styles.counterButton, { backgroundColor: colors.primary }]}
                  onPress={() => setRestTime(restTime + 15)}
                >
                  <Feather name="plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Feather name="play" size={24} color="#FFFFFF" />
            <Text style={styles.startButtonText}>Begin Workout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.workoutContainer}>
          {isResting ? (
            <View style={[styles.restCard, { backgroundColor: colors.card }]}>
              <Feather name="coffee" size={60} color="#FF9800" />
              <Text style={[styles.restTitle, { color: colors.text }]}>Rest Time</Text>
              <Text style={[styles.timerText, { color: colors.primary }]}>{timer}s</Text>
              <Text style={[styles.nextSetText, { color: colors.textSecondary }]}>
                Next: Set {currentSet} of {sets}
              </Text>
              <TouchableOpacity 
                style={styles.skipButton}
                onPress={handleSkipRest}
              >
                <Text style={styles.skipButtonText}>Skip Rest</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.activeWorkoutCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.setTitle, { color: colors.text }]}>
                Set {currentSet} of {sets}
              </Text>
              <Text style={[styles.repsTitle, { color: colors.primary }]}>
                {reps} Reps
              </Text>
              
              <View style={[styles.instructionsBox, { backgroundColor: colors.background }]}>
                <Feather name="info" size={20} color="#4FC3F7" />
                <Text style={[styles.instructionsText, { color: colors.text }]}>
                  {exercise.instructions || 'Perform the exercise with proper form'}
                </Text>
              </View>

              <TouchableOpacity 
                style={styles.completeButton}
                onPress={handleCompleteSet}
              >
                <Feather name="check" size={24} color="#FFFFFF" />
                <Text style={styles.completeButtonText}>
                  {currentSet === sets ? 'Finish Workout' : 'Complete Set'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentSet - (isResting ? 1 : 0)) / sets) * 100}%` }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary }]}>
              {currentSet - (isResting ? 1 : 0)} of {sets} sets completed
            </Text>
          </View>
        </View>
      )}

      <View style={[styles.tipsSection, { backgroundColor: colors.card }]}>
        <Text style={[styles.tipsTitle, { color: colors.text }]}>Tips</Text>
        <View style={styles.tipItem}>
          <Feather name="check-circle" size={16} color="#4CAF50" />
          <Text style={[styles.tipText, { color: colors.text }]}>
            Focus on proper form over speed
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Feather name="check-circle" size={16} color="#4CAF50" />
          <Text style={[styles.tipText, { color: colors.text }]}>
            Breathe steadily throughout each rep
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Feather name="check-circle" size={16} color="#4CAF50" />
          <Text style={[styles.tipText, { color: colors.text }]}>
            Stay hydrated during your workout
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
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
  exerciseInfo: {
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
  },
  exerciseImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  exerciseTarget: {
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  setupContainer: {
    padding: 16,
  },
  setupCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  setupLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  counterButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 24,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'center',
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#4FC3F7',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutContainer: {
    padding: 16,
  },
  restCard: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
    marginBottom: 20,
  },
  restTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nextSetText: {
    fontSize: 16,
    marginBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4FC3F7',
  },
  skipButtonText: {
    color: '#4FC3F7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeWorkoutCard: {
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  setTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  repsTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructionsBox: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 8,
    gap: 10,
    marginBottom: 30,
    width: '100%',
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  completeButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4FC3F7',
  },
  progressText: {
    fontSize: 14,
  },
  tipsSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
