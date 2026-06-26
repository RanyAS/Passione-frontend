import {Ionicons} from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { styles } from '../styles/HomeMapScreen';
import { useLocation } from '../hooks/useLocation';
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';


import { EmptyState } from '../components/empty-state';
import { homeFilters } from '../components/data/meshitime-data';
import { useMeshitime } from '../../provider/meshitime-provider';
import type { Restaurant } from '../../types/meshitime';
import { triggerFeedback } from '../../utils/feedback';
import { NativeMap } from '../components/native-map.native';

import { formatYen } from '../../utils/screen-utils';


interface HomeMapScreenProps {
  onOpenRestaurant: (restaurantId: string) => void;
}

// function getRestaurantImage(restaurant: Restaurant) {
//     // 画像URLが存在する場合はそれを返す
//     return 'https://picsum.photos/seed/' + restaurant.id + '/1000/640';
// }

function getRestaurantImage(restaurantId: string) {
  return `https://picsum.photos/seed/${restaurantId}/1000/640`;
}

export function HomeMapScreen({ onOpenRestaurant }: HomeMapScreenProps) {
    const {
        filteredRestaurants,
        restaurants,
        searchText,
        selectedFilter,
        setSearchText,
        setSelectedFilter,
    } = useMeshitime();
    
    const { region, setRegion, getCurrentLocation } = useLocation({
      latitude: 35.6762,
      longitude: 139.6503,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    
    const pins = useMemo(
        () => (filteredRestaurants.length > 0 ? filteredRestaurants : restaurants).slice(0, 10),
        [filteredRestaurants, restaurants]
    );
    
    const handlePinPress = (restaurant: Restaurant) => {
        triggerFeedback('light');
        setSelectedRestaurant(restaurant);
    };
    
    return (
        <View style={styles.container}>
            <NativeMap
                style={styles.mapBase}
                initialRegion={region}
                region={region}
                pins={pins}
                onMarkerPress={handlePinPress}
                markerBubbleStyle={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: '#E85D04',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                markerBubbleInactiveStyle={{
                    backgroundColor: '#9CA3AF',
                }}
                markerTextStyle={{
                    fontSize: 20,
                }}
            />
      
      <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          accessibilityLabel="レストラン検索"
          value={searchText}
          onChangeText={setSearchText}
          placeholder="レストランを探す..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>
      
      
       <ScrollView
        horizontal
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
        showsHorizontalScrollIndicator={false}>
        {homeFilters.map((filter: typeof homeFilters[number]) => {
          const isActive = filter.value === selectedFilter;
          return (
            <Pressable
              key={filter.value}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setSelectedFilter(filter.value)}
              accessibilityRole="button">
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {filter.icon} {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      
      
      <Pressable
        style={styles.bottomPeek}
        onPress={() => setSelectedRestaurant(pins[0] ?? null)}
        accessibilityRole="button">
        <View style={styles.peekHandle} />
        <Text style={styles.peekTitle}>{filteredRestaurants.length}件のお得情報</Text>
        <Text style={styles.peekSubtitle}>あなたの近くで利用可能</Text>
      </Pressable>
      
      
      <Modal
        visible={Boolean(selectedRestaurant)}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRestaurant(null)}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSelectedRestaurant(null)} />
          <View style={styles.modalCard}>
            <View style={styles.peekHandle} />
            {selectedRestaurant ? (
              <>
                <View style={styles.modalImageWrap}>
                  <Image
                    source={{ uri: getRestaurantImage(selectedRestaurant.id), cacheKey: selectedRestaurant.id }}
                    transition={250}
                    cachePolicy="memory-disk"
                    contentFit="cover"
                    style={styles.modalImage}
                  />
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{selectedRestaurant.deal.discountLabel}</Text>
                  </View>
                </View>
                <View style={styles.modalBody}>
                  <Text style={styles.modalTitle}>{selectedRestaurant.name}</Text>
                  <Text style={styles.modalMeta}>
                    空席: {selectedRestaurant.deal.availableSeats}席 / 締切: {selectedRestaurant.deal.deadlineLabel}
                  </Text>
                  <Text style={styles.modalPrice}>
                    <Text style={styles.modalOriginalPrice}>
                      {formatYen(selectedRestaurant.deal.originalPrice)}
                    </Text>{' '}
                    {formatYen(selectedRestaurant.deal.dealPrice)}
                  </Text>
                  <View style={styles.modalButtons}>
                    <Pressable style={styles.secondaryCta}>
                      <Text style={styles.secondaryCtaText}>ルート案内</Text>
                    </Pressable>
                    <Pressable
                      style={styles.primaryCta}
                      onPress={() => {
                        const id = selectedRestaurant.id;
                        setSelectedRestaurant(null);
                        onOpenRestaurant(id);
                      }}>
                      <Text style={styles.primaryCtaText}>今すぐ予約</Text>
                    </Pressable>
                  </View>
                </View>
              </>
            ) : (
                <EmptyState
                emoji="🍜"
                title="レストランが見つかりません"
                description="他の条件で検索してみてください" />
            )}
            </View>
        </View>
    </Modal> 
    /*back to my location button*/
    <Pressable
      style={styles.backToMyLocationButton}
      onPress={async () => {
        const location = await getCurrentLocation();
        if (location) {
          setRegion((prev) => ({
            ...prev,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }));
        }
      }}>
      <Ionicons name="locate-outline" size={27} color="#ffffff" />
      <Text style={styles.backToMyLocationText}></Text>
    </Pressable>
 </View>
 );
}

export default HomeMapScreen;