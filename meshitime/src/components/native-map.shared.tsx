import React, { useMemo } from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { Restaurant } from '../../types/meshitime';
//import from .env
const FALLBACK_GOOGLE_MAPS_API_KEY= process.env.GOOGLE_MAPS_API_KEY ?? '';


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
}

export function NativeMap({
  style,
  initialRegion,
  region,
  pins,
  onMarkerPress,
}: NativeMapProps) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? FALLBACK_GOOGLE_MAPS_API_KEY;
  const hasValidApiKey = apiKey && apiKey !== 'YOUR_GOOGLE_MAPS_API_KEY';
  const activeRegion = region ?? initialRegion;

  const zoomLevel = useMemo(() => {
    if (!activeRegion.longitudeDelta) {
      return 13;
    }
    const derivedZoom = Math.log2(360 / activeRegion.longitudeDelta);
    return Math.min(18, Math.max(3, derivedZoom));
  }, [activeRegion.longitudeDelta]);

  const pinsPayload = useMemo(
    () =>
      JSON.stringify(
        pins.map((p, index) => ({
          id: p.id ?? index,
          lat: p.coordinates.latitude,
          lng: p.coordinates.longitude,
          icon: p.emoji ?? '📍',
          active: p.pinPosition?.active ?? true,
        }))
      ),
    [pins]
  );

  const html = useMemo(
    () => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
    <style>
      html, body, #map { width:100%; height:100%; margin:0; padding:0; }
      #map { position:absolute; inset:0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"></script>
    <script>
      const center = { lat: ${activeRegion.latitude}, lng: ${activeRegion.longitude} };
      const zoom = ${Math.round(zoomLevel)};
      const pins = ${pinsPayload};

      function init() {
        const map = new google.maps.Map(document.getElementById('map'), {
          center,
          zoom,
          disableDefaultUI: true,
        });

        pins.forEach((pin) => {
          const marker = new google.maps.Marker({
            position: { lat: pin.lat, lng: pin.lng },
            map,
            label: pin.icon ? { text: pin.icon, fontSize: '18px' } : undefined,
          });
          marker.addListener('click', () => {
            window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'pin', id: pin.id }));
          });
        });
      }
      window.onload = init;
    </script>
  </body>
</html>
    `,
    [activeRegion.latitude, activeRegion.longitude, zoomLevel, pinsPayload]
  );

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data);
      if (payload.type === 'pin') {
        const pin = pins.find((p, index) => (p.id ?? index) === payload.id);
        if (pin) {
          onMarkerPress(pin);
        }
      }
    } catch {
      // ignore malformed messages
    }
  };

  return (
    <View style={[styles.container, style]}>
      {hasValidApiKey ? (
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          mixedContentMode="always"
          setSupportMultipleWindows={false}
          androidLayerType="hardware"
          scrollEnabled={false}
          onMessage={handleMessage}
        />
      ) : (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Missing API KEY</Text>
          <Text style={styles.errorText}>
            Put your EXPO_PUBLIC_GOOGLE_MAPS_API_KEY or Put your API key in to native-map.shared.tsx.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320,
  },
  webview: {
    flex: 1,
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  errorTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  errorText: {
    textAlign: 'center',
    color: '#555',
  },
});
