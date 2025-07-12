import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

type SectionHeaderProps = {
  title: string;
  showMore?: boolean;
  onShowMorePress?: () => void;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, showMore, onShowMorePress }) => {
  return (
    <View className="flex-row items-center justify-between px-4 py-2 my-3">
      <Text className="text-lg font-semibold text-white">{title}</Text>
      {showMore && (
        <TouchableOpacity onPress={onShowMorePress}>
          <Text className="text-blue-500 text-sm">Show more</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
