/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, Pressable, Text, ToastAndroid, View} from 'react-native';
import {ShowList} from '../enums/showList';

export default function UserList({
  users,
  showListStatus,
  setShowListStatus,
  isTimerRunning,
}: {
  users: any;
  showListStatus: ShowList;
  setShowListStatus: any;
  isTimerRunning: boolean;
  setIsTimerRunning: any;
}) {
  return (
    <View
      style={{
        flex: showListStatus === ShowList.Users ? 1 : 0,
        gap: 8,
        paddingVertical: 15,
        borderRadius: 5,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '700',
          }}>
          List User
        </Text>
        <Text
          onPress={() => {
            if (showListStatus !== ShowList.Users) {
              setShowListStatus(ShowList.Users);
            } else {
              setShowListStatus(ShowList.None);
            }
          }}
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: 'gray',
          }}>
          {showListStatus === ShowList.Users ? 'Hide' : 'Show'}
        </Text>
      </View>

      {showListStatus === ShowList.Users ? (
        <FlatList
          style={{
            paddingHorizontal: 15,
          }}
          data={users}
          renderItem={({item}) => (
            <View
              style={{
                padding: 5,
                borderRadius: 5,
                marginVertical: 5,
                backgroundColor: 'gray',
                flexDirection: 'row',
              }}>
              <Text style={{flex: 4, color: 'white'}}>{item.email}</Text>
              <Pressable
                onPress={() => {
                  if (!isTimerRunning) {
                  } else {
                    ToastAndroid.show('To many request', ToastAndroid.SHORT);
                  }
                }}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed ? 'gray' : 'white',
                  },
                  {
                    borderRadius: 5,
                    paddingHorizontal: 8,
                    paddingVertical: 1,
                  },
                ]}>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'right',
                  }}>
                  Action
                </Text>
              </Pressable>
            </View>
          )}
        />
      ) : null}
    </View>
  );
}
