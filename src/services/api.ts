import axios from 'axios';
import { LoginCredentials, RegisterData } from '../types';

const AUTH_API = 'https://dummyjson.com';
const API_NINJAS_URL = 'https://api.api-ninjas.com/v1/exercises';
const API_NINJAS_KEY = 'YOUR_API_KEY_HERE'; // Get free key from https://api-ninjas.com

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post(`${AUTH_API}/auth/login`, credentials);
    return response.data;
  },
  
  getUser: async (userId: number) => {
    const response = await axios.get(`${AUTH_API}/users/${userId}`);
    return response.data;
  },
};

// API Ninjas configuration
const apiNinjasConfig = {
  headers: {
    'X-Api-Key': API_NINJAS_KEY
  }
};

// Generate a consistent image URL based on exercise name
const generateImageUrl = (name: string, type: string) => {
  // Use a hash of the name to generate consistent but varied images
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = 1000 + (hash % 500); // Generate IDs between 1000-1500
  return `https://picsum.photos/seed/${name.toLowerCase().replace(/\s+/g, '-')}/400/400`;
};

// Map API Ninjas data to our app format
const mapApiNinjasData = (exercise: any, index: number) => ({
  id: `ex_${index}_${exercise.name.replace(/\s+/g, '_').toLowerCase()}`,
  name: exercise.name,
  gifUrl: generateImageUrl(exercise.name, exercise.type),
  target: exercise.muscle,
  bodyPart: exercise.type,
  equipment: exercise.equipment,
  description: `${exercise.name} is a ${exercise.difficulty} level exercise that targets your ${exercise.muscle}. This exercise is great for building strength and improving your fitness.`,
  difficulty: exercise.difficulty,
  instructions: exercise.instructions,
  rating: exercise.difficulty === 'beginner' ? 4.2 : exercise.difficulty === 'intermediate' ? 4.5 : 4.8,
});

// Fitness exercises API
export const exercisesApi = {
  getExercises: async (muscle?: string, limit: number = 20) => {
    try {
      // Check if API key is set
      if (!API_NINJAS_KEY || API_NINJAS_KEY === 'YOUR_API_KEY_HERE') {
        console.warn('API Ninjas key not set. Using demo data.');
        return getDemoExercises();
      }

      const params: any = { offset: 0 };
      if (muscle) {
        params.muscle = muscle;
      }

      const response = await axios.get(API_NINJAS_URL, {
        ...apiNinjasConfig,
        params
      });

      // API Ninjas returns array of exercises
      const exercises = response.data.slice(0, limit);
      return exercises.map((ex: any, idx: number) => mapApiNinjasData(ex, idx));
    } catch (error) {
      console.error('Error fetching exercises from API Ninjas:', error);
      return getDemoExercises();
    }
  },
  
  getExerciseById: async (id: string) => {
    try {
      const exercises = await exercisesApi.getExercises();
      const exercise = exercises.find((ex: any) => ex.id === id);
      
      if (!exercise) {
        throw new Error('Exercise not found');
      }
      
      return exercise;
    } catch (error) {
      console.error('Error fetching exercise by ID:', error);
      throw error;
    }
  },

  getExercisesByBodyPart: async (bodyPart: string) => {
    return exercisesApi.getExercises(bodyPart, 20);
  },

  searchExercises: async (query: string) => {
    try {
      if (!API_NINJAS_KEY || API_NINJAS_KEY === 'YOUR_API_KEY_HERE') {
        const exercises = getDemoExercises();
        return exercises.filter((ex: any) => 
          ex.name.toLowerCase().includes(query.toLowerCase()) ||
          ex.target.toLowerCase().includes(query.toLowerCase())
        );
      }

      // API Ninjas supports name search
      const response = await axios.get(API_NINJAS_URL, {
        ...apiNinjasConfig,
        params: { name: query }
      });

      return response.data.map((ex: any, idx: number) => mapApiNinjasData(ex, idx));
    } catch (error) {
      console.error('Error searching exercises:', error);
      return [];
    }
  },
};

// Demo exercises with real exercise data from API Ninjas format
const getDemoExercises = () => [
  {
    id: 'ex_0_bench_press',
    name: 'Bench Press',
    gifUrl: generateImageUrl('Bench Press', 'strength'),
    target: 'chest',
    bodyPart: 'strength',
    equipment: 'barbell',
    description: 'Bench Press is a intermediate level exercise that targets your chest. This exercise is great for building strength and improving your fitness.',
    difficulty: 'intermediate',
    instructions: 'Lie flat on a bench with your feet on the floor. Grip the barbell with hands slightly wider than shoulder width. Lower the bar to your chest, then press it back up to the starting position.',
    rating: 4.5,
  },
  {
    id: 'ex_1_squat',
    name: 'Squat',
    gifUrl: generateImageUrl('Squat', 'strength'),
    target: 'quadriceps',
    bodyPart: 'strength',
    equipment: 'barbell',
    description: 'Squat is a intermediate level exercise that targets your quadriceps. This exercise is great for building strength and improving your fitness.',
    difficulty: 'intermediate',
    instructions: 'Stand with feet shoulder-width apart. Lower your body by bending your knees and hips, keeping your back straight. Push through your heels to return to starting position.',
    rating: 4.5,
  },
  {
    id: 'ex_2_deadlift',
    name: 'Deadlift',
    gifUrl: generateImageUrl('Deadlift', 'strength'),
    target: 'lower_back',
    bodyPart: 'strength',
    equipment: 'barbell',
    description: 'Deadlift is a expert level exercise that targets your lower_back. This exercise is great for building strength and improving your fitness.',
    difficulty: 'expert',
    instructions: 'Stand with feet hip-width apart, barbell over your feet. Bend at hips and knees, grip the bar. Lift by extending hips and knees, keeping the bar close to your body.',
    rating: 4.8,
  },
  {
    id: 'ex_3_pull_up',
    name: 'Pull-up',
    gifUrl: generateImageUrl('Pull-up', 'strength'),
    target: 'lats',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Pull-up is a intermediate level exercise that targets your lats. This exercise is great for building strength and improving your fitness.',
    difficulty: 'intermediate',
    instructions: 'Hang from a pull-up bar with arms fully extended. Pull yourself up until your chin is above the bar. Lower yourself back down with control.',
    rating: 4.5,
  },
  {
    id: 'ex_4_push_up',
    name: 'Push-up',
    gifUrl: generateImageUrl('Push-up', 'strength'),
    target: 'chest',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Push-up is a beginner level exercise that targets your chest. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Start in a plank position with hands shoulder-width apart. Lower your body until chest nearly touches the floor. Push back up to starting position.',
    rating: 4.2,
  },
  {
    id: 'ex_5_bicep_curl',
    name: 'Bicep Curl',
    gifUrl: generateImageUrl('Bicep Curl', 'strength'),
    target: 'biceps',
    bodyPart: 'strength',
    equipment: 'dumbbell',
    description: 'Bicep Curl is a beginner level exercise that targets your biceps. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Stand with dumbbells at your sides, palms facing forward. Curl the weights up to shoulder level. Lower back down with control.',
    rating: 4.2,
  },
  {
    id: 'ex_6_shoulder_press',
    name: 'Shoulder Press',
    gifUrl: generateImageUrl('Shoulder Press', 'strength'),
    target: 'shoulders',
    bodyPart: 'strength',
    equipment: 'dumbbell',
    description: 'Shoulder Press is a beginner level exercise that targets your shoulders. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Hold dumbbells at shoulder height. Press weights overhead until arms are fully extended. Lower back to shoulder height.',
    rating: 4.2,
  },
  {
    id: 'ex_7_lunges',
    name: 'Lunges',
    gifUrl: generateImageUrl('Lunges', 'strength'),
    target: 'quadriceps',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Lunges is a beginner level exercise that targets your quadriceps. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Step forward with one leg, lowering your hips until both knees are bent at 90 degrees. Push back to starting position and repeat with other leg.',
    rating: 4.2,
  },
  {
    id: 'ex_8_plank',
    name: 'Plank',
    gifUrl: generateImageUrl('Plank', 'strength'),
    target: 'abdominals',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Plank is a beginner level exercise that targets your abdominals. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Get into a push-up position but rest on your forearms. Keep your body in a straight line from head to heels. Hold this position.',
    rating: 4.2,
  },
  {
    id: 'ex_9_mountain_climbers',
    name: 'Mountain Climbers',
    gifUrl: generateImageUrl('Mountain Climbers', 'cardio'),
    target: 'abdominals',
    bodyPart: 'cardio',
    equipment: 'body_only',
    description: 'Mountain Climbers is a intermediate level exercise that targets your abdominals. This exercise is great for building strength and improving your fitness.',
    difficulty: 'intermediate',
    instructions: 'Start in a plank position. Alternate bringing your knees to your chest in a running motion while keeping your core engaged.',
    rating: 4.5,
  },
  {
    id: 'ex_10_burpees',
    name: 'Burpees',
    gifUrl: generateImageUrl('Burpees', 'cardio'),
    target: 'abdominals',
    bodyPart: 'cardio',
    equipment: 'body_only',
    description: 'Burpees is a intermediate level exercise that targets your abdominals. This exercise is great for building strength and improving your fitness.',
    difficulty: 'intermediate',
    instructions: 'Start standing. Drop to a plank, do a push-up, jump feet to hands, then jump up with arms overhead. Repeat continuously.',
    rating: 4.5,
  },
  {
    id: 'ex_11_jumping_jacks',
    name: 'Jumping Jacks',
    gifUrl: generateImageUrl('Jumping Jacks', 'cardio'),
    target: 'abdominals',
    bodyPart: 'cardio',
    equipment: 'body_only',
    description: 'Jumping Jacks is a beginner level exercise that targets your abdominals. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Start with feet together and hands at sides. Jump feet apart while raising arms overhead. Jump back to starting position.',
    rating: 4.2,
  },
  {
    id: 'ex_12_tricep_dips',
    name: 'Tricep Dips',
    gifUrl: generateImageUrl('Tricep Dips', 'strength'),
    target: 'triceps',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Tricep Dips is a intermediate level exercise that targets your triceps. This exercise is great for building strength and improving your fitness.',
    difficulty: 'intermediate',
    instructions: 'Position hands on a bench behind you. Lower your body by bending elbows to 90 degrees. Push back up to starting position.',
    rating: 4.5,
  },
  {
    id: 'ex_13_leg_raises',
    name: 'Leg Raises',
    gifUrl: generateImageUrl('Leg Raises', 'strength'),
    target: 'abdominals',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Leg Raises is a intermediate level exercise that targets your abdominals. This exercise is great for building strength and improving your fitness.',
    difficulty: 'intermediate',
    instructions: 'Lie on your back with legs straight. Raise legs to vertical position keeping them straight. Lower back down without touching the floor.',
    rating: 4.5,
  },
  {
    id: 'ex_14_crunches',
    name: 'Crunches',
    gifUrl: generateImageUrl('Crunches', 'strength'),
    target: 'abdominals',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Crunches is a beginner level exercise that targets your abdominals. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Lie on your back with knees bent. Place hands behind head. Curl upper body toward knees. Lower back down with control.',
    rating: 4.2,
  },
  {
    id: 'ex_15_russian_twists',
    name: 'Russian Twists',
    gifUrl: generateImageUrl('Russian Twists', 'strength'),
    target: 'abdominals',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Russian Twists is a intermediate level exercise that targets your abdominals. This exercise is great for building strength and improving your fitness.',
    difficulty: 'intermediate',
    instructions: 'Sit with knees bent and feet off the ground. Lean back slightly. Rotate your torso from side to side, touching the ground beside you.',
    rating: 4.5,
  },
  {
    id: 'ex_16_side_plank',
    name: 'Side Plank',
    gifUrl: generateImageUrl('Side Plank', 'strength'),
    target: 'abdominals',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Side Plank is a intermediate level exercise that targets your abdominals. This exercise is great for building strength and improving your fitness.',
    difficulty: 'intermediate',
    instructions: 'Lie on your side and prop yourself up on one forearm. Keep body in a straight line. Hold this position, then switch sides.',
    rating: 4.5,
  },
  {
    id: 'ex_17_wall_sit',
    name: 'Wall Sit',
    gifUrl: generateImageUrl('Wall Sit', 'strength'),
    target: 'quadriceps',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Wall Sit is a beginner level exercise that targets your quadriceps. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Lean against a wall and slide down until thighs are parallel to ground. Keep back flat against wall. Hold this position.',
    rating: 4.2,
  },
  {
    id: 'ex_18_calf_raises',
    name: 'Calf Raises',
    gifUrl: generateImageUrl('Calf Raises', 'strength'),
    target: 'calves',
    bodyPart: 'strength',
    equipment: 'body_only',
    description: 'Calf Raises is a beginner level exercise that targets your calves. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Stand with feet hip-width apart. Rise up onto your toes as high as possible. Lower back down with control. Repeat.',
    rating: 4.2,
  },
  {
    id: 'ex_19_high_knees',
    name: 'High Knees',
    gifUrl: generateImageUrl('High Knees', 'cardio'),
    target: 'quadriceps',
    bodyPart: 'cardio',
    equipment: 'body_only',
    description: 'High Knees is a beginner level exercise that targets your quadriceps. This exercise is great for building strength and improving your fitness.',
    difficulty: 'beginner',
    instructions: 'Run in place while lifting your knees as high as possible. Pump your arms and maintain a quick pace.',
    rating: 4.2,
  },
];
