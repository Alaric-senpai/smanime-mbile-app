import { Stack, useRouter } from 'expo-router';
import { FlatList, Image, Text, View, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BellIcon } from 'lucide-react-native';
import { logoFull } from '~/constant/images'; // Ensure this path is correct
import SectionHeader from '~/components/SectionHeader'; // Ensure this path is correct
import { useEffect, useState, useCallback } from 'react';
import { topClient } from '~/lib/instances'; // Only topClient needed now
import { Anime } from '@tutkli/jikan-ts';
import AnimeCard from '~/components/AnimeCard'; // Ensure this path is correct
import SearchBar from '~/components/SearchComponent'; // Ensure this path is correct


const HomeHeader = () => {
  const router = useRouter();

  const handleSearchSubmit = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <View className="bg-dark px-4 pt-4 pb-2"> {/* Added horizontal padding */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <Image source={logoFull} className="h-[30px] w-[30px] rounded-full" />
          <Text className="text-light-100 font-semibold tracking-wide text-lg">SmAnime</Text>
        </View>
        <TouchableOpacity className="p-2 rounded-full bg-dark-700"> {/* Added a subtle background */}
            <BellIcon color="white" size={22} />
        </TouchableOpacity>
      </View>
      <SearchBar onSubmit={handleSearchSubmit} />

      {/* Section Header for the main list */}
      <SectionHeader title="Top Airing Anime" showMore={true}   />
    </View>
  );
};

export default function Home() {
  const [animeData, setAnimeData] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnime = useCallback(async () => {
    setLoading(true);
    setRefreshing(true); // Indicate refreshing even if data is initially loading
    try {
      const res = await topClient.getTopAnime({ filter: 'airing' }); // Fetch only top airing
      if (res.data) {
        setAnimeData(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch top airing anime:", error);
      // Optionally show a toast/alert to the user
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnime();
  }, [fetchAnime]);

  const onRefresh = useCallback(() => {
    fetchAnime(); // Trigger a refetch on pull-to-refresh
  }, [fetchAnime]);

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={animeData}
        renderItem={({ item }) => <AnimeCard anime={item} />}
        keyExtractor={(item, index) => index.toString()} // Use mal_id for stable keys
        ListHeaderComponent={<HomeHeader />}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }} // Adjust padding for cards
        ListEmptyComponent={
          loading && !refreshing ? ( // Only show main loader if not already refreshing
            <View className="flex-1 items-center justify-center mt-8">
              <ActivityIndicator size="large" color="#00FF85" />
              <Text className="text-gray-400 mt-2">Loading top anime...</Text>
            </View>
          ) : (animeData.length === 0 && !loading) ? ( // Show "No data" if list is empty and not loading
            <View className="flex-1 items-center justify-center mt-8">
              <Text className="text-gray-400">No top airing anime available.</Text>
            </View>
          ) : null // Don't render anything if refreshing (refresh indicator is active)
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00FF85" // Accent color for the refresh indicator
          />
        }
      />
    </SafeAreaView>
  );
}