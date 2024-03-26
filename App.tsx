/*import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VideoListScreen from './screens/VideoListScreen.js';
import VideoPlayerScreen from './screens/VideoPlayerScreen.js';
import { enableScreens } from 'react-native-screens'; 

enableScreens(); // Call enableScreens to optimize memory usage for screen components

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="VideoList">
        <Stack.Screen name="VideoList" component={VideoListScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import VideoListScreen from './screens/VideoListScreen.js';
import VideoPlayerScreen from './screens/VideoPlayerScreen.js';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

enableScreens();

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="VideoList">
            <Stack.Screen name="Movie List" component={VideoListScreen} />
            <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}