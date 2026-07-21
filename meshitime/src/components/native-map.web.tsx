import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import type { Restaurant } from "../../types/meshitime";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

interface NativeMapProps {
  style?: ViewStyle;
  initialRegion: Region;
  region: Region;
  pins: Restaurant[];
  onMarkerPress: (restaurant: Restaurant) => void;
  markerBubbleStyle: ViewStyle;
  markerBubbleInactiveStyle: ViewStyle;
  markerTextStyle: any;
  showsUserLocation?: boolean;
}

export function NativeMap({ style }: NativeMapProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Map disponible uniquement sur mobile</Text>
      <Text style={styles.subtitle}>Android / iOS uniquement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
  },
});
