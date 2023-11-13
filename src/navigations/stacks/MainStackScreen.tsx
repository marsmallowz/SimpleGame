import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {MainStackParamList} from '../types/mainStackParamList';
import HomeScreen from '../../screens/HomeScreen';
import SubAreaScreen from '../../screens/SubAreaScreen';
import {SocketProvider} from '../../contexts/SocketContext';

export default function MainStackScreen() {
  const MainStack = createNativeStackNavigator<MainStackParamList>();

  return (
    <SocketProvider>
      <MainStack.Navigator initialRouteName="Home">
        <MainStack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <MainStack.Screen name="SubArea" component={SubAreaScreen} />
      </MainStack.Navigator>
    </SocketProvider>
  );
}
