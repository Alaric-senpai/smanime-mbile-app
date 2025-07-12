import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, Star, Clapperboard, CalendarDays } from 'lucide-react-native';
import { Anime } from '@tutkli/jikan-ts';
import { useRouter } from 'expo-router';

type AnimeCardProps = {
  anime: Anime;
  onPressFavorite?: (animeId: number) => void; // Optional prop for favorite action
  isFavorite?: boolean; // Optional prop to indicate if anime is favorited
};

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onPressFavorite, isFavorite = false }) => {
  const router = useRouter();

  const handleCardPress = () => {
    router.push(`/anime/${anime.mal_id}`);
  };

  const handleFavoritePress = () => {
    if (onPressFavorite) {
      onPressFavorite(anime.mal_id);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      className="bg-dark-800 rounded-xl overflow-hidden mx-3 my-2 shadow-lg"
      activeOpacity={0.8}
      style={styles.cardShadow}
    >
      <Image
        source={{ uri: anime.images.jpg.large_image_url || anime.images.jpg.image_url }}
        className="h-48 w-full"
        resizeMode="cover"
      />
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <Text
            className="text-light-100 font-bold text-lg flex-1 pr-2"
            numberOfLines={2}
          >
            {anime.title}
          </Text>
          <TouchableOpacity
            onPress={handleFavoritePress}
            className={`w-9 h-9 rounded-full items-center justify-center ${isFavorite ? 'bg-accent' : 'border border-gray-500'}`}
            activeOpacity={0.7}
          >
            <Heart color={isFavorite ? 'black' : 'white'} size={20} fill={isFavorite ? 'black' : 'none'} />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-1">
          <Star color="#FFD700" size={16} fill="#FFD700" />
          <Text className="text-light-100 text-sm ml-1">
            {anime.score ? anime.score.toFixed(2) : 'N/A'}
          </Text>
          <Text className="text-gray-500 text-xs ml-2">({anime.scored_by?.toLocaleString() ?? '0'} votes)</Text>
        </View>

        <View className="flex-row items-center mb-1">
          <Clapperboard color="white" size={16} />
          <Text className="text-gray-500 text-sm ml-1">
            Episodes: {anime.episodes ?? 'N/A'}
          </Text>
        </View>

        {anime.aired.prop.from && (
          <View className="flex-row items-center">
            <CalendarDays color="white" size={16} />
            <Text className="text-gray-500 text-sm ml-1">
              Aired: {new Date(anime.aired.prop.from.year, anime.aired.prop.from.month - 1, anime.aired.prop.from.day).getFullYear()}
            </Text>
          </View>
        )}

        {anime.genres && anime.genres.length > 0 && (
          <View className="flex-row flex-wrap mt-2">
            {anime.genres.slice(0, 3).map((genre) => ( // Display up to 3 genres
              <View key={genre.mal_id} className="bg-dark-700 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-gray-500 text-xs">{genre.name}</Text>
              </View>
            ))}
            {anime.genres.length > 3 && (
              <Text className="text-gray-500 text-xs px-3 py-1 mr-2 mb-2">+ {anime.genres.length - 3} more</Text>
            )}
          </View>
        )}

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
  },
});

export default AnimeCard;