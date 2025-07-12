import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { Container } from '~/components/Container'; // Assuming this is correctly configured
import { animeClient } from '~/lib/instances'; // Assuming this is correctly configured
import { Anime } from '@tutkli/jikan-ts';
import { ArrowLeftCircle, Heart, Star, Clapperboard, MonitorPlay, Users, BookMarked, Tags } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function AnimeDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // State for favorite status

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const res = await animeClient.getAnimeFullById(Number(id));
        setAnime(res.data);
        // Simulate checking if it's a favorite (e.g., from local storage or API)
        setIsFavorite(Math.random() > 0.5); // Random for demo
      } catch (e) {
        console.error('Failed to fetch anime:', e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAnime();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark">
        <ActivityIndicator size="large" color="#00FF85" />
      </View>
    );
  }

  if (!anime) {
    return (
      <View className="flex-1 items-center justify-center bg-dark">
        <Text className="text-light-100 text-lg">Anime not found.</Text>
      </View>
    );
  }

  return (
    <Container>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView className="bg-dark flex-1">
        {/* Header Image with Overlay */}
        <View className="relative w-full h-[380px]">
          <Image
            source={{ uri: anime.images.jpg.large_image_url || anime.images.jpg.image_url }}
            className="w-full h-full rounded-b-3xl"
            resizeMode="cover"
          />
          {/* Gradient Overlay for better text readability */}
          <View className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-80 rounded-b-3xl" />

          {/* Back and Favorite Buttons */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-14 left-5 w-12 h-12 rounded-full flex items-center justify-center bg-black/50 shadow-lg"
          >
            <ArrowLeftCircle color={'white'} size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFavorite(!isFavorite)}
            className={`absolute top-14 right-5 w-12 h-12 rounded-full items-center justify-center shadow-lg ${isFavorite ? 'bg-accent/80' : 'bg-black/50'}`}
          >
            <Heart color={isFavorite ? 'black' : 'white'} size={24} fill={isFavorite ? 'black' : 'none'} />
          </TouchableOpacity>

          {/* Title and Score/Episodes Info */}
          <View className="absolute bottom-5 left-0 right-0 px-5">
            <Text
              className="text-light-100 text-3xl font-extrabold mb-2"
              numberOfLines={2}
            >
              {anime.title}
            </Text>
            <View className="flex-row items-center">
              <Star color="#FFD700" size={20} fill="#FFD700" />
              <Text className="text-light-100 text-lg ml-1 mr-4">
                {anime.score ? anime.score.toFixed(2) : 'N/A'}
              </Text>
              <Clapperboard color="white" size={18} />
              <Text className="text-gray-400 text-base ml-1">
                Episodes: {anime.episodes ?? 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content Section (all info displayed directly) */}
        <View className="bg-dark rounded-t-2xl mt-[-20px] pt-4 px-4 pb-12 overflow-hidden">
          {/* Main info cards */}
          <View className="flex-row justify-around p-4 mb-6 bg-dark-800 rounded-lg mx-0 shadow-md">
            <View className="items-center flex-1">
              <MonitorPlay color="#00FF85" size={24} />
              <Text className="text-light-100 text-sm mt-1 font-semibold text-center">{anime.type ?? 'N/A'}</Text>
              <Text className="text-gray-500 text-xs text-center">Type</Text>
            </View>
            <View className="items-center flex-1">
              <Users color="#00FF85" size={24} />
              <Text className="text-light-100 text-sm mt-1 font-semibold text-center">{anime.members?.toLocaleString() ?? 'N/A'}</Text>
              <Text className="text-gray-500 text-xs text-center">Members</Text>
            </View>
            <View className="items-center flex-1">
              <BookMarked color="#00FF85" size={24} />
              <Text className="text-light-100 text-sm mt-1 font-semibold text-center">{anime.status ?? 'N/A'}</Text>
              <Text className="text-gray-500 text-xs text-center">Status</Text>
            </View>
            <View className="items-center flex-1">
              <Tags color="#00FF85" size={24} />
              <Text className="text-light-100 text-sm mt-1 font-semibold text-center">{anime.rank ?? 'N/A'}</Text>
              <Text className="text-gray-500 text-xs text-center">Rank</Text>
            </View>
          </View>

          {/* Synopsis */}
          {anime.synopsis && (
            <View className="mb-6">
              <Text className="text-light-100 text-xl font-bold mb-2">Synopsis</Text>
              <Text className="text-gray-300 text-base leading-relaxed">
                {anime.synopsis}
              </Text>
            </View>
          )}

          {/* Background */}
          {anime.background && (
            <View className="mb-6">
              <Text className="text-light-100 text-xl font-bold mb-2">Background</Text>
              <Text className="text-gray-300 text-base leading-relaxed">
                {anime.background}
              </Text>
            </View>
          )}

          {/* Key Details - Aired, Duration, etc. */}
          <View className="flex-row flex-wrap justify-between mb-6">
            {anime.aired && (
              <View className="w-1/2 pr-2 mb-4">
                <Text className="text-light-100 text-lg font-semibold mb-1">Aired</Text>
                <Text className="text-gray-300 text-base">{anime.aired.to}</Text>
              </View>
            )}

            {anime.duration && (
              <View className="w-1/2 pl-2 mb-4">
                <Text className="text-light-100 text-lg font-semibold mb-1">Duration</Text>
                <Text className="text-gray-300 text-base">{anime.duration}</Text>
              </View>
            )}

            {/* Source */}
            {anime.source && (
              <View className="w-1/2 pr-2 mb-4">
                <Text className="text-light-100 text-lg font-semibold mb-1">Source</Text>
                <Text className="text-gray-300 text-base">{anime.source}</Text>
              </View>
            )}

            {/* Rating */}
            {anime.rating && (
              <View className="w-1/2 pl-2 mb-4">
                <Text className="text-light-100 text-lg font-semibold mb-1">Rating</Text>
                <Text className="text-gray-300 text-base">{anime.rating}</Text>
              </View>
            )}
          </View>

          {/* Producers */}
          {anime.producers && anime.producers.length > 0 && (
            <View className="mb-6">
              <Text className="text-light-100 text-lg font-semibold mb-1">Producers</Text>
              <Text className="text-gray-300 text-base">
                {anime.producers.map((p) => p.name).join(', ')}
              </Text>
            </View>
          )}

          {/* Studios */}
          {anime.studios && anime.studios.length > 0 && (
            <View className="mb-6">
              <Text className="text-light-100 text-lg font-semibold mb-1">Studios</Text>
              <Text className="text-gray-300 text-base">
                {anime.studios.map((s) => s.name).join(', ')}
              </Text>
            </View>
          )}

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <View className="mb-6">
              <Text className="text-light-100 text-lg font-semibold mb-1">Genres</Text>
              <View className="flex-row flex-wrap">
                {anime.genres.map((g) => (
                  <View key={g.mal_id} className="bg-dark-700 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-gray-500 text-xs">{g.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Explicit Genres */}
          {anime.explicit_genres && anime.explicit_genres.length > 0 && (
            <View className="mb-6">
              <Text className="text-light-100 text-lg font-semibold mb-1">Explicit Genres</Text>
              <View className="flex-row flex-wrap">
                {anime.explicit_genres.map((g) => (
                  <View key={g.mal_id} className="bg-red-700 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-white text-xs">{g.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Themes */}
          {anime.themes && anime.themes.length > 0 && (
            <View className="mb-6">
              <Text className="text-light-100 text-lg font-semibold mb-1">Themes</Text>
              <View className="flex-row flex-wrap">
                {anime.themes.map((t) => (
                  <View key={t.mal_id} className="bg-dark-700 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-gray-500 text-xs">{t.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Demographics */}
          {anime.demographics && anime.demographics.length > 0 && (
            <View className="mb-6">
              <Text className="text-light-100 text-lg font-semibold mb-1">Demographics</Text>
              <View className="flex-row flex-wrap">
                {anime.demographics.map((d) => (
                  <View key={d.mal_id} className="bg-dark-700 rounded-full px-3 py-1 mr-2 mb-2">
                    <Text className="text-gray-500 text-xs">{d.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Related Anime Placeholder (if you want to add this later) */}
          {anime.relations && anime.relations.length > 0 && (
              <View className="mb-6">
                  <Text className="text-light-100 text-xl font-bold mb-2">Related Titles</Text>
                  {/* You would map over anime.relations here to display related titles/cards */}
                  <Text className="text-gray-500 text-sm">Related anime content would be listed here, e.g., prequels, sequels, spin-offs.</Text>
              </View>
          )}

          {/* External Links Placeholder (if you want to add this later) */}
          {anime.external && anime.external.length > 0 && (
              <View className="mb-6">
                  <Text className="text-light-100 text-xl font-bold mb-2">External Links</Text>
                  {/* You would map over anime.external here to display links */}
                  <Text className="text-gray-500 text-sm">Links to official sites, databases, etc., would be here.</Text>
              </View>
          )}

        </View>
      </ScrollView>
    </Container>
  );
}