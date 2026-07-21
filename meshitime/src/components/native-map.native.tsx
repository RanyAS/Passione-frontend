import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { AppleMaps, GoogleMaps } from "expo-maps";
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
  /** Only enable after location permission is granted */
  showsUserLocation?: boolean;
}

function deltaToZoom(longitudeDelta: number) {
  if (!longitudeDelta || longitudeDelta <= 0) {
    return 12;
  }
  const derived = Math.log2(360 / longitudeDelta);
  return Math.min(20, Math.max(3, derived));
}

export function NativeMap({
  style,
  initialRegion,
  region,
  pins,
  onMarkerPress,
  showsUserLocation = false,
}: NativeMapProps) {
  const appleRef = useRef<AppleMaps.MapView>(null);
  const googleRef = useRef<GoogleMaps.MapView>(null);
  const activeRegion = region ?? initialRegion;
  const isFirstCamera = useRef(true);

  const cameraPosition = {
    coordinates: {
      latitude: activeRegion.latitude,
      longitude: activeRegion.longitude,
    },
    zoom: deltaToZoom(activeRegion.longitudeDelta),
  };

  useEffect(() => {
    if (isFirstCamera.current) {
      isFirstCamera.current = false;
      return;
    }

    if (Platform.OS === "ios") {
      appleRef.current?.setCameraPosition(cameraPosition);
    } else if (Platform.OS === "android") {
      googleRef.current?.setCameraPosition({
        ...cameraPosition,
        duration: 600,
      });
    }
  }, [activeRegion.latitude, activeRegion.longitude, activeRegion.longitudeDelta]);

  const googleMarkers = pins.map((pin, index) => ({
    id: pin.id ?? String(index),
    coordinates: {
      latitude: pin.coordinates.latitude,
      longitude: pin.coordinates.longitude,
    },
    title: pin.name,
    snippet: pin.deal?.discountLabel,
  }));

  const appleMarkers = pins.map((pin, index) => ({
    id: pin.id ?? String(index),
    coordinates: {
      latitude: pin.coordinates.latitude,
      longitude: pin.coordinates.longitude,
    },
    title: pin.name,
    tintColor: pin.pinPosition?.active === false ? "#9CA3AF" : "#E85D04",
    systemImage: "fork.knife",
  }));

  const handleMarkerClick = (marker: { id?: string }) => {
    const clicked = pins.find(
      (pin, index) => (pin.id ?? String(index)) === marker.id
    );
    if (clicked) {
      onMarkerPress(clicked);
    }
  };

  if (Platform.OS === "ios") {
    return (
      <View style={[styles.container, style]}>
        <AppleMaps.View
          ref={appleRef}
          style={StyleSheet.absoluteFill}
          cameraPosition={cameraPosition}
          markers={appleMarkers}
          properties={{
            isTrafficEnabled: false,
            isMyLocationEnabled: showsUserLocation,
            mapType: AppleMaps.MapType.STANDARD,
            selectionEnabled: true,
          }}
          uiSettings={{
            myLocationButtonEnabled: false,
          }}
          onMarkerClick={handleMarkerClick}
        />
      </View>
    );
  }

  if (Platform.OS === "android") {
    return (
      <View style={[styles.container, style]}>
        <GoogleMaps.View
          ref={googleRef}
          style={StyleSheet.absoluteFill}
          cameraPosition={cameraPosition}
          markers={googleMarkers}
          properties={{
            isBuildingEnabled: true,
            isIndoorEnabled: true,
            mapType: GoogleMaps.MapType.NORMAL,
            selectionEnabled: true,
            isMyLocationEnabled: showsUserLocation,
            isTrafficEnabled: false,
          }}
          uiSettings={{
            myLocationButtonEnabled: false,
            zoomControlsEnabled: false,
          }}
          onMarkerClick={handleMarkerClick}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, style, styles.fallback]}>
      <Text style={styles.fallbackText}>Maps disponibles sur Android et iOS uniquement</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320,
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
  },
  fallbackText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
  },
});
