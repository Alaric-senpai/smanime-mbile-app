import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { router } from 'expo-router';

type SearchBarProps = {
  onSubmit: (query: string) => void; // Now required, passed from parent
  initialQuery?: string; // New prop to set initial value
  placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSubmit, initialQuery = '', placeholder = 'Search anime...' }) => {
  const [query, setQuery] = useState(initialQuery);

  // Update internal query state if initialQuery prop changes (e.g., from URL param)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = () => {
    const trimmed = query.trim();
    onSubmit(trimmed); // Call the onSubmit prop
  };

  const clearInput = () => {
    setQuery('');
    onSubmit(''); // Also trigger a search with an empty query to clear results
  };

  return (
    <View className="flex-row items-center bg-dark-800 rounded-full px-4 py-3 mx-4 mt-4 mb-2 shadow-md">
      <Search color="#7A7A7A" size={20} />
      <TextInput
        className="flex-1 ml-3 text-light-100 text-base" // Enhanced text styling
        placeholder={placeholder}
        placeholderTextColor="#7A7A7A"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={clearInput} className="ml-2 p-1">
          <X size={20} color="#7A7A7A" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;