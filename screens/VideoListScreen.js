
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: 'black',
    
  },
  posterImage: {
    width: 200,
    height: 300,
    alignSelf: 'center',
    marginLeft: 50,
    marginTop: 55,
  },
});

export default function VideoListScreen({ navigation }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false); // State variable to track video playing status

  const videos = [
    { id: 1, url: 'https://d1g6vi8lsykj44.cloudfront.net/Dunki.mp4', poster: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcT_zknBiKeCfJue-g52vMLHzNZ0u2rlgkvbRaH5kHeoQoibFm92&psig=AOvVaw0XnMQySa6RG_UEh_XMBa_Y&ust=1711438750590000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCIjN6qf0joUDFQAAAAAdAAAAABAE', title: 'Dunki' },
    { id: 2, url: 'https://d1g6vi8lsykj44.cloudfront.net/8K%20HDR%20_%20The%20Mirror%20Dimension%20(Spider-Man_%20No%20Way%20Home)%20_%20Dolby%205.1.mp4', poster: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fencrypted-tbn0.gstatic.com%2Fimages%3Fq%3Dtbn%3AANd9GcTtauzk4w5HwCXrx3nAm5VTFcywz62gV18C3A7KFT03SgB2k8c0&psig=AOvVaw01LTptfCmQI_RtJk5I9lBu&ust=1711438977201000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOjvh5T1joUDFQAAAAAdAAAAABAE', title: 'Spider-Man: No Way Home' },
  ];

  const handlePlayVideo = (videoUrl) => {
    setIsVideoPlaying(true); 
    navigation.navigate('VideoPlayer', { videoUrl });
  };

  return (
    <View>
      {videos.map(video => (
        <View key={video.id} style={styles.videoContainer}>
          <TouchableOpacity onPress={() => handlePlayVideo(video.url)}>
            <Image source={{ uri: video.poster }} style={styles.posterImage} />
          </TouchableOpacity>
          {!isVideoPlaying && (
            <Text style={styles.videoName}>{video.title}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

