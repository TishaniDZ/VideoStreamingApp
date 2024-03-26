import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoPlayer: {
    flex: 1,
  },
});

export default function VideoPlayerScreen({ route }) {
  const { videoUrl } = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUrl }}
        style={styles.videoPlayer} // Set style for Video component
        resizeMode="cover" // Cover mode to fill the entire container
        fullscreen={true} // Enable full-screen mode
        controls={true}
      />
    </View>
  );
}
