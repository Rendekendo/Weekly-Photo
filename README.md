# Weekly Photo App

Mobile application for capturing a weekly photo and viewing a timeline.  
Built with **React Native** and **Expo**, this app lets users take photos, store them locally, and display a simple gallery with the last photo overlay.

## Features

- Camera capture with front/back camera toggle
- Overlay of last photo for reference
- Automatic saving to a custom album
- Local storage of images using Expo Media Library
- Simple gallery and timeline view
- Permission handling for camera and media library

## Technologies

- React Native
- Expo (Camera, MediaLibrary, Router)
- TypeScript / JavaScript
- React components and hooks

### Take a Picture Screen

- Live camera preview with front/back toggle
- Oval overlay for framing the subject
- Semi-transparent overlay of the last photo taken
- Snap button to take a picture and save it to the album

```
CameraView
- Flip Button (toggle front/back)
- Snap Button (capture photo)
- Last photo overlay
- Oval overlay
```

### Gallery

- Shows all weekly photos in a timeline-style view
- Users can browse photos previously taken

## How It Works

1. On app start, permissions for camera and media library are requested.
2. Users navigate to "Take a Picture":
   - Camera preview is shown
   - Overlay of last photo helps align the shot
   - Snap button captures the photo
3. Photos are saved automatically to the "WeeklyPhoto" album.
4. Users can view all saved photos in the gallery screen.

## Notes

- Uses **CameraView** from `expo-camera` for live previews
- Uses **MediaLibrary** from `expo-media-library` for local storage
- Overlay ensures consistent weekly framing for photos
- Dark theme interface for better visual focus
