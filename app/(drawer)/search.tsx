import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { ActivityIndicator, FlatList, Text, View, RefreshControl } from 'react-native'; // Import RefreshControl
import { animeClient } from '~/lib/instances';
import { Anime } from '@tutkli/jikan-ts';
import AnimeCard from '~/components/AnimeCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '~/components/SearchComponent'; // Import the SearchBar component

export default function SearchScreen() {
  const router = useRouter();
  const { query: initialQuery } = useLocalSearchParams(); // Rename for clarity
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>(initialQuery as string || '');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false); // Initialize as false, fetch on mount if query exists
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  const performSearch = useCallback(async (searchQ: string) => {
    if (!searchQ.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await animeClient.getAnimeSearch({ q: searchQ });
      setResults(res.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
      setRefreshing(false); // Stop refreshing regardless of success/failure
    }
  }, []); // useCallback memoizes the function

  // Effect to run initial search or when the external query param changes
  useEffect(() => {
    if (initialQuery && typeof initialQuery === 'string') {
      setCurrentSearchQuery(initialQuery);
      performSearch(initialQuery);
    } else {
      setLoading(false); // No initial query, so not loading
    }
  }, [initialQuery, performSearch]);

  const handleSearchSubmit = (newQuery: string) => {
    if (newQuery.trim() !== currentSearchQuery.trim()) {
      setCurrentSearchQuery(newQuery);
      router.setParams({ query: newQuery }); // Update the URL param
      performSearch(newQuery);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    performSearch(currentSearchQuery);
  }, [currentSearchQuery, performSearch]);

  return (
    <SafeAreaView className="flex-1 bg-dark">
      {/* Search Bar at the top of the search screen */}
      <SearchBar
        initialQuery={currentSearchQuery} // Pass the current query to the SearchBar
        onSubmit={handleSearchSubmit}
        placeholder="Search again..."
        // No need for clearable here, as it's handled internally by SearchBar
      />

      <Text className="text-light-100 text-lg font-semibold px-4 mt-4 mb-2">
        Results for: "{currentSearchQuery || '...'}"
      </Text>

      {loading && !refreshing ? ( // Show loader only if not refreshing
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00FF85" />
        </View>
      ) : results.length === 0 && currentSearchQuery.trim() !== '' && !loading ? (
        // Only show "No results" if a query was made and no results found, and not currently loading
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-base">No results found for "{currentSearchQuery}".</Text>
        </View>
      ) : results.length === 0 && currentSearchQuery.trim() === '' && !loading ? (
        // Initial state or cleared search bar
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-base">Enter a query to start searching for anime.</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => <AnimeCard anime={item} />}
          keyExtractor={(item) => item.mal_id.toString()} // Use mal_id for unique keys
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}

          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00FF85" // Accent color for the refresh indicator
            />
          }
        />
      )}
    </SafeAreaView>
  );
}