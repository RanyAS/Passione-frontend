import React, { useMemo, useState } from 'react';
import { StyleSheet, View, ViewStyle, Text } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import Constants from 'expo-constants';
import type { Restaurant } from '../../types/meshitime';

const EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const expoConfig = Constants.expoConfig as any;
const CONFIG_ANDROID_GOOGLE_MAPS_API_KEY =
  expoConfig?.android?.config?.googleMaps?.apiKey ??
  expoConfig?.android?.config?.googleMapsApiKey ??
  '';
const CONFIG_IOS_GOOGLE_MAPS_API_KEY =
  expoConfig?.ios?.config?.googleMapsApiKey ??
  expoConfig?.ios?.config?.googleMaps?.apiKey ??
  '';

function normalizeApiKey(value: string) {
  return value.replace(/\u0000/g, '').replace(/^['"]|['"]$/g, '').trim();
}

function isLikelyGoogleMapsApiKey(value: string) {
  return /^AIza[0-9A-Za-z_-]{20,}$/.test(value);
}

function resolveApiKey(candidates: string[]) {
  for (const candidate of candidates) {
    const normalized = normalizeApiKey(candidate);
    if (normalized && normalized !== 'YOUR_GOOGLE_MAPS_API_KEY' && isLikelyGoogleMapsApiKey(normalized)) {
      return normalized;
    }
  }
  return '';
}


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
  const apiKey = resolveApiKey([
    EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
    CONFIG_ANDROID_GOOGLE_MAPS_API_KEY,
    CONFIG_IOS_GOOGLE_MAPS_API_KEY,
  ]);
  const hasValidApiKey = Boolean(apiKey);
  const activeRegion = region ?? initialRegion;
  const [mapLoadFailed, setMapLoadFailed] = useState(false);

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
      html, body, #map { width:100%; height:100%; margin:0; padding:0; background:#f3f4f6; }
      #map { position:absolute; inset:0; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      window.initMap = function () {
        try {
          const center = { lat: ${activeRegion.latitude}, lng: ${activeRegion.longitude} };
          const zoom = ${Math.round(zoomLevel)};
          const pins = ${pinsPayload};
          const map = new google.maps.Map(document.getElementById('map'), {
            center,
            zoom,
            disableDefaultUI: true,
            gestureHandling: 'greedy',
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
        } catch (error) {
          window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'error', message: String(error) }));
        }
      };
    </script>
    <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap" async defer></script>
  </body>
</html>
    `,
    [apiKey, activeRegion.latitude, activeRegion.longitude, zoomLevel, pinsPayload]
  );

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data);
      if (payload.type === 'pin') {
        const pin = pins.find((p, index) => (p.id ?? index) === payload.id);
        if (pin) {
          onMarkerPress(pin);
        }
      } else if (payload.type === 'error') {
        setMapLoadFailed(true);
        console.warn('Google Maps init error', payload.message);
      }
    } catch {
      // ignore malformed messages
    }
  };

  return (
    <View style={[styles.container, style]}>
      {hasValidApiKey ? (
        mapLoadFailed ? (
          <View style={styles.fallbackBox}>
            <Text style={styles.fallbackTitle}>Carte indisponible</Text>
            <Text style={styles.fallbackText}>
              Le chargement de Google Maps a échoué. Rechargez l’écran ou vérifiez votre connexion.
            </Text>
          </View>
        ) : (
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
            cacheEnabled={false}
            onMessage={handleMessage}
            onError={(e) => {
              setMapLoadFailed(true);
              console.warn('WebView error', e.nativeEvent);
            }}
            onHttpError={(e) => {
              setMapLoadFailed(true);
              console.warn('WebView HTTP error', e.nativeEvent);
            }}
          />
        )
      ) : (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Missing API KEY</Text>
          <Text style={styles.errorText}>
            Set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in .env to display the map.
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
  fallbackBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
  },
  fallbackTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 6,
  },
  fallbackText: {
    textAlign: 'center',
    color: '#555',
    lineHeight: 20,
  },
});
