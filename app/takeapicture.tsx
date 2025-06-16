import { useEffect, useRef, useState } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [lastPhotoUri, setLastPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef(null);
  const albumName = 'WeeklyPhoto';

  const loadLastPhotoFromAlbum = async () => {
    const album = await MediaLibrary.getAlbumAsync(albumName);
    if (album) {
      const assets = await MediaLibrary.getAssetsAsync({
        album: album,
        first: 1,
        sortBy: [[MediaLibrary.SortBy.creationTime, false]],
      });
      if (assets.assets.length > 0) {
        setLastPhotoUri(assets.assets[0].uri);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (!cameraPermission?.granted) {
        await requestCameraPermission();
      }
      if (!mediaPermission?.granted) {
        await requestMediaPermission();
      }

      if (mediaPermission?.granted) {
        await loadLastPhotoFromAlbum();
      }
    })();
  }, [cameraPermission, mediaPermission]);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handleSnap = async () => {
    if (!cameraPermission?.granted || !mediaPermission?.granted) {
      console.warn('Permissions not granted yet!');
      return;
    }

    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log('Photo taken:', photo.uri);

      try {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        let album = await MediaLibrary.getAlbumAsync(albumName);

        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          console.log('Photo added to existing album:', albumName);
        } else {
          await MediaLibrary.createAlbumAsync(albumName, asset, false);
          console.log('Album created and photo added:', albumName);
        }

        await loadLastPhotoFromAlbum();
      } catch (error) {
        console.error('Error saving photo to album:', error);
      }
    }
  };

  if (!cameraPermission || !mediaPermission) return <View />;

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission is required</Text>
        <Button onPress={requestCameraPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  if (!mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Media Library permission is required</Text>
        <Button onPress={requestMediaPermission} title="Grant Media Permission" />
      </View>
    );
  }

return (
  <View style={styles.container}>
    <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
      {lastPhotoUri && (
        <View pointerEvents="none" style={styles.overlayContainer}>
          <Image 
          source={{ uri: lastPhotoUri }} 
          style={[
            styles.overlayImage, 
            facing === 'front' && { transform: [{ scaleX: -1 }] }
          ]} 
        />
        </View>
      )}

      {/* Always show the oval overlay */}
      <View pointerEvents="none" style={styles.ellipseOverlay} />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.switchButton} onPress={toggleCameraFacing}>
          <Text style={styles.controlText}>Flip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.snapButton} onPress={handleSnap}>
          <View style={styles.snapCircle} />
        </TouchableOpacity>
      </View>
    </CameraView>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  overlayImage: {
    flex: 1,
    resizeMode: 'cover',
  },
ellipseOverlay: {
  position: 'absolute',
  top: '28%',
  left: '50%',
  width: 230,
  height: 350,
  borderTopLeftRadius: 200,
  borderTopRightRadius: 200,
  borderBottomRightRadius: 400,  
  borderBottomLeftRadius: 400,   
  borderWidth: 3,
  borderColor: 'white',
  opacity: 0.7,
  backgroundColor: 'transparent',
  marginLeft: -115, // center horizontally (half width)
},
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  snapCircle: {
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#aaa',
  },
  switchButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
  },
  controlText: {
    color: '#fff',
    fontSize: 16,
  },
});
