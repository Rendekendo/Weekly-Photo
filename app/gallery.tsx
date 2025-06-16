import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const albumName = 'WeeklyPhoto';

export default function Files() {
  const [photos, setPhotos] = useState<MediaLibrary.Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [permission, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      } else if (!permission.granted) {
        await requestPermission();
      } else {
        loadPhotos();
      }
    })();
  }, [permission]);

  const loadPhotos = async () => {
    try {
      const album = await MediaLibrary.getAlbumAsync(albumName);
      if (!album) {
        setPhotos([]);
        setLoading(false);
        return;
      }

      //(max 100 photos, adjust if needed)
      const assets = await MediaLibrary.getAssetsAsync({
        album: album,
        first: 100,
        mediaType: ['photo'],
        sortBy: ['creationTime'],
      });

      setPhotos(assets.assets);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const imageSize = screenWidth / numColumns - 4; // minus margin

  const renderItem = ({ item }: { item: MediaLibrary.Asset }) => (
    <Image
      source={{ uri: item.uri }}
      style={{ width: imageSize, height: imageSize, margin: 2, borderRadius: 8 }}
      resizeMode="cover"
    />
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#666" />
        <Text style={{ color: '#666', marginTop: 10 }}>Loading photos...</Text>
      </View>
    );
  }

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#666', marginBottom: 10 }}>Permission required to access photos</Text>
      </View>
    );
  }

  if (photos.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#666' }}>No photos found in the "{albumName}" album.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={photos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      numColumns={numColumns}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
