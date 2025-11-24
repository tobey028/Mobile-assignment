import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/store';
import { removeFavorite, setFavorites } from '../../src/store/favoritesSlice';
import { storage } from '../../src/utils/storage';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../src/utils/useTheme';

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const savedFavorites = await storage.getFavorites();
    dispatch(setFavorites(savedFavorites));
  };

  const handleRemoveFavorite = async (id: string) => {
    dispatch(removeFavorite(id));
    const updatedFavorites = favorites.filter(item => item.id !== id);
    await storage.saveFavorites(updatedFavorites);
  };

  const renderFavoriteCard = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => router.push(`/details/${item.id}`)}
    >
      <Image 
        source={{ uri: item.gifUrl }} 
        style={styles.cardImage}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>{item.name}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Feather name="target" size={14} color="#4FC3F7" />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.target}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="package" size={14} color="#FF9800" />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.equipment}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <Feather name="heart" size={24} color="#F44336" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (favorites.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Feather name="heart" size={80} color={colors.border} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favorites Yet</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Start adding exercises to your favorites!
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        renderItem={renderFavoriteCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#757575',
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  cardImage: {
    width: 100,
    height: 100,
    backgroundColor: '#E0E0E0',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#757575',
    textTransform: 'capitalize',
  },
  removeButton: {
    padding: 12,
    justifyContent: 'center',
  },
});
