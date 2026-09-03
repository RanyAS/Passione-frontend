import {Ionicons} from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { styles } from '../styles/HomeMapScreen';
import { useLocation } from '../hooks/useLocation';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

import { EmptyState } from '../components/empty-state';
import { DEFAULT_MAP_CENTER, homeFilters } from '../components/data/meshitime-data';
import { useMeshitime } from '../../provider/meshitime-provider';
import type { Restaurant, RestaurantCategory } from '../../types/meshitime';
import { triggerFeedback } from '../../utils/feedback';
import { NativeMap } from '../components/native-map';

import { formatYen } from '../../utils/screen-utils';
import { router } from 'expo-router';

import { getAllActiveStorePins } from '@/api/StorePinApi';
import { storePinToRestaurant } from '@/utils/storePinToRestaurant';
import { StorePin } from '@/types/StorePin';


interface HomeMapScreenProps {
  onOpenRestaurant?: (restaurantId: string) => void;
}

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
        refreshRestaurants,
    } = useMeshitime();
    
    const { region, setRegion, getCurrentLocation } = useLocation({
      latitude: DEFAULT_MAP_CENTER.latitude,
      longitude: DEFAULT_MAP_CENTER.longitude,
      latitudeDelta: 0.012,
      longitudeDelta: 0.012,
    });
    
    const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [showsUserLocation, setShowsUserLocation] = useState(false);

    const [storePins, setStorePins] = useState<StorePin[]>([]);
    const pinRestaurants = useMemo(() => storePins.map(storePinToRestaurant), [storePins]);

    const refreshStorePins = async () => {
      try {
        const data = await getAllActiveStorePins();
        setStorePins(data);
      } catch (error) {
        console.error("Failed to load store pins:", error);
      }
    };

    useEffect(() => {
      void refreshRestaurants();
      void refreshStorePins();
    }, [refreshRestaurants]);

    const pins = useMemo(() => {
      const normalRestaurants =
        filteredRestaurants.length > 0
          ? filteredRestaurants
          : restaurants;

      return [
        ...normalRestaurants,
        ...pinRestaurants,
      ];
    }, [
      filteredRestaurants,
      restaurants,
      pinRestaurants,
    ]);
    
    const handlePinPress = (restaurant: Restaurant) => {
        triggerFeedback('light');
        setSelectedRestaurant(restaurant);
    };

    const handleFilterPress = (filterValue: RestaurantCategory) => {
      setSelectedFilter(filterValue);
      router.push({
        pathname: '/SearchResultsScreen',
        params: {
          filter: filterValue,
          query: searchText || undefined,
        },
      });
    };

    const handleBackToMyLocation = async () => {
      if (isLocating) {
        return;
      }

      try {
        setIsLocating(true);
        triggerFeedback('light');
        const location = await getCurrentLocation();

        if (!location) {
          setShowsUserLocation(false);
          Alert.alert(
            '位置情報',
            '現在地を取得できません。位置情報の許可を確認するか、最新の開発ビルドをインストールしてください。'
          );
          return;
        }

        setShowsUserLocation(true);
        setRegion((prev) => ({
          ...prev,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }));
      } catch {
        Alert.alert('位置情報', '現在地の取得に失敗しました。もう一度お試しください。');
      } finally {
        setIsLocating(false);
      }
    };
    
    return (
        <View style={styles.container}>
            <NativeMap
                style={styles.mapBase}
                initialRegion={region}
                region={region}
                pins={pins}
                onMarkerPress={handlePinPress}
                showsUserLocation={showsUserLocation}
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
              onPress={() => handleFilterPress(filter.value)}
              accessibilityRole="button">
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {filter.icon} {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      
            
      <View style={styles.bottomPeek}>
        <View style={styles.peekHandle} />
        <Text style={styles.peekTitle}>{pinRestaurants.length}件のお得情報</Text>
        <Text style={styles.peekSubtitle}>あなたの近くで利用可能</Text>
        <View style={styles.bottomActions}>
          <Pressable style={styles.bottomActionButton} onPress={() => router.push('/favorites')}>
            <Text style={styles.bottomActionText}>お気に入り</Text>
          </Pressable>
          <Pressable style={styles.bottomActionButton} onPress={() => router.push('/profile')}>
            <Text style={styles.bottomActionText}>プロフィール</Text>
          </Pressable>
        </View>
      </View>
      
      
      <Modal
  visible={Boolean(selectedRestaurant)}
  transparent
  animationType="slide"
  onRequestClose={() => setSelectedRestaurant(null)}
>
  <View style={styles.modalContainer}>
    <Pressable
      style={styles.modalBackdrop}
      onPress={() => setSelectedRestaurant(null)}
    />

    <View style={styles.modalCard}>
      <View style={styles.peekHandle} />

      {selectedRestaurant ? (
        <>
          <View style={styles.modalImageWrap}>
            <Image
              source={{
                uri: getRestaurantImage(selectedRestaurant.id),
                cacheKey: selectedRestaurant.id,
              }}
              transition={250}
              cachePolicy="memory-disk"
              contentFit="cover"
              style={styles.modalImage}
            />

            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {selectedRestaurant.deal.discountLabel}
              </Text>
            </View>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>
              {selectedRestaurant.name}
            </Text>

            <Text style={styles.modalMeta}>
              空席: {selectedRestaurant.deal.availableSeats}席
            </Text>

            <Text style={{fontSize: 14, color: '#6B7280', marginTop: 6, marginBottom: 12}}>
              {selectedRestaurant.deal.campaign}
            </Text>

            <View style={styles.modalButtons}>
              {/* 詳細を見る */}
              <Pressable
                style={styles.secondaryCta}
                onPress={() => {
                  const pinId = selectedRestaurant.id;

                  setSelectedRestaurant(null);

                  router.push({
                    pathname: "/restaurant-detail",
                    params: {
                      id: pinId,
                    },
                  });
                }}
              >
                <Text style={styles.secondaryCtaText}>
                  詳細を見る
                </Text>
              </Pressable>

              {/* 今すぐ予約 */}
              <Pressable
                style={styles.primaryCta}
                onPress={() => {
                  const storeId = selectedRestaurant.id;
                  const pinId = selectedRestaurant.id;

                  setSelectedRestaurant(null);

                  router.push({
                    pathname: "/ConfirmationScreen",
                    params: {
                      storeId,
                      pinId,
                      partySize: "1",
                    },
                  });
                }}
              >
                <Text style={styles.primaryCtaText}>
                  今すぐ予約
                </Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <EmptyState
          emoji="🍜"
          title="レストランが見つかりません"
          description="他の条件で検索してみてください"
        />
      )}
    </View>
  </View>
</Modal>
    <Pressable
      style={[styles.backToMyLocationButton, isLocating && styles.backToMyLocationButtonDisabled]}
      onPress={handleBackToMyLocation}
      disabled={isLocating}
      accessibilityRole="button"
      accessibilityLabel="現在地に戻る">
      {isLocating ? (
        <ActivityIndicator color="#E85D04" size="small" />
      ) : (
        <Ionicons name="locate" size={24} color="#E85D04" />
      )}
    </Pressable>
 </View>
 );
}

export default HomeMapScreen;