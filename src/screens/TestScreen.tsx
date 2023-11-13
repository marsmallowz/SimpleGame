/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

export default function TestScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'yellow',
          height: 200,
          width: 200,
        }}></View>
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          height: 100,
          width: 100,
        }}></View>
    </View>
  );
}
