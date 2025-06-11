import React from 'react';
import { View, Text, Button, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const Files = () => {
  const saveFileExternally = async () => {
    try {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        Alert.alert('Permission Denied', 'You need to grant access to a folder.');
        return;
      }

      const folderUri = permissions.directoryUri;

      const fileName = 'example.txt';
      const fileContents = 'Hello from StorageAccessFramework!';
      
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        folderUri,
        fileName,
        'text/plain'
      );

      await FileSystem.writeAsStringAsync(fileUri, fileContents, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      Alert.alert('Success', `Saved file:\n${fileUri}`);
    } catch (error) {
      console.error('Error saving file:', error);
      Alert.alert('Error', 'Failed to save file.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
      <Text style={{ color: '#fff', marginBottom: 20 }}>Save File Outside App</Text>
      <Button title="Save to Downloads or other folder" onPress={saveFileExternally} />
    </View>
  );
};

export default Files;
