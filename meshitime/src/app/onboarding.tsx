import React, { useRef, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';

import { styles } from '../styles/onboarding.styles';

// ─── Types ───────────────────────────────────────────────────────────────────

interface SlideData {
  id: string;
  title: string;
  emoji?: string; // Placeholder for illustration/icon
  description: string;
  bgColor: string; // pastel circle background
  // Replace this placeholder with your actual image/icon component

}

// ─── Slide Data ───────────────────────────────────────────────────────────────
// TODO: Replace `illustration` with your <Image> or icon component per slide.

const slides: SlideData[] = [
  {
    id: '1',
    title: '空席をお得に活用',
    emoji: '🍜',
    description: 'レストランの空席時間を見つけて、特別価格で食事を楽しもう',
    bgColor: '#FDE8D8',// e.g. <Image source={require('../assets/bowl.png')} style={styles.image} />
  },
  {
    id: '2',
    title: 'リアルタイムオファーを受け取る',
    emoji: '📍',
    description: 'あなたの近くの最新のお得情報をリアルタイムで確認',
    bgColor: '#E8EEF8',
  },
  {
    id: '3',
    title: '今すぐ始めよう',
    emoji: '🎉',
    description: 'めしタイムで、毎日の食事をもっと楽しく、もっとお得に',
    bgColor: '#FCE8EE',
  },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

const Slide = ({ item, slideWidth }: { item: SlideData; slideWidth: number }) => (
  <View style={[styles.slide, { width: slideWidth }]}>
    {/* Illustration circle */}
<View style={[styles.illustrationCircle, { backgroundColor: item.bgColor }]}>
      {item.emoji ? (
  <Text style={{ fontSize: 100, textAlign: 'center' }}>{item.emoji}</Text>
) : (
  <View style={styles.illustrationCircle} />
)}
    </View>

    {/* Text */}
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.description}>{item.description}</Text>
  </View>
);

const Dots = ({ activeIndex }: { activeIndex: number }) => (
  <View style={styles.dotsRow}>
    {slides.map((_, i) => (
      <View
        key={i}
        style={[styles.dot, i === activeIndex ? styles.dotActive : styles.dotInactive]}
      />
    ))}
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

interface OnboardingScreenProps {
  onFinish: () => void; // called when user taps "始める" on last slide
}

const OnboardingScreen = ({ onFinish }: OnboardingScreenProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<SlideData>>(null);
  const { width: screenWidth } = useWindowDimensions();

  const isFirst = activeIndex === 0;
  const isLast = activeIndex === slides.length - 1;

  // Track which slide is visible
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(index, slides.length - 1));
    setActiveIndex(clamped);
    flatListRef.current?.scrollToOffset({
      offset: screenWidth * clamped,
      animated: true,
    });
  };

  const goToNext = () => {
    if (isLast) {
      onFinish();
      return;
    }
    scrollToSlide(activeIndex + 1);
  };

  const goToPrev = () => {
    if (activeIndex > 0) {
      scrollToSlide(activeIndex - 1);
    }
  };

  const skip = () => onFinish();

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={skip}>
        <Text style={styles.skipText}>スキップ</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Slide item={item} slideWidth={screenWidth} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        style={[styles.flatList, { width: screenWidth }]}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onScrollToIndexFailed={({ index }) => {
          // In case measurement isn't ready yet, fall back to offset scrolling.
          flatListRef.current?.scrollToOffset({
            offset: screenWidth * index,
            animated: true,
          });
        }}
      />

      {/* Dots */}
      <Dots activeIndex={activeIndex} />

      {/* Navigation buttons */}
      <View style={styles.buttonRow}>
        {!isFirst && (
          <TouchableOpacity style={styles.backButton} onPress={goToPrev}>
            <Text style={styles.backButtonText}>戻る</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, isFirst && styles.nextButtonFull]}
          onPress={goToNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {isLast ? '始める' : '次へ  >'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;