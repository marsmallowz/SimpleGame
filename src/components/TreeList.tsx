/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {FlatList, Pressable, Text, ToastAndroid, View} from 'react-native';
import {ShowList} from '../enums/showList';
import {SocketContext} from '../contexts/SocketContext';

export default function TreeList({
  refresh,
  trees,
  showListStatus,
  setShowListStatus,
  isTimerRunning,
  setIsTimerRunning,
}: {
  refresh: () => void;
  trees: Array<{
    _id: string;
    quantity: number;
    name: string;
  }>;
  showListStatus: ShowList;
  setShowListStatus: React.Dispatch<React.SetStateAction<ShowList>>;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {socket} = useContext(SocketContext);

  return (
    <View
      style={{
        flex: showListStatus === ShowList.Trees ? 1 : 0,
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
          List Tree
        </Text>
        <View style={{flexDirection: 'row', gap: 8}}>
          {showListStatus === ShowList.Trees ? (
            <Text
              onPress={() => {
                refresh();
                ToastAndroid.show('Trees refresh', ToastAndroid.SHORT);
              }}
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: 'gray',
              }}>
              Refresh
            </Text>
          ) : null}
          <Text
            onPress={() => {
              if (showListStatus !== ShowList.Trees) {
                setShowListStatus(ShowList.Trees);
              } else {
                setShowListStatus(ShowList.None);
              }
            }}
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: 'gray',
            }}>
            {showListStatus === ShowList.Trees ? 'Hide' : 'Show'}
          </Text>
        </View>
      </View>
      {showListStatus === ShowList.Trees ? (
        <FlatList
          style={{
            paddingHorizontal: 15,
          }}
          data={trees}
          renderItem={({item}) => (
            <View
              style={{
                padding: 5,
                borderRadius: 5,
                marginVertical: 5,
                backgroundColor: 'gray',
                flexDirection: 'row',
              }}>
              <Text style={{flex: 4, color: 'white'}}>
                {item.name} x{item.quantity}
              </Text>
              <Pressable
                onPress={() => {
                  if (!isTimerRunning) {
                    socket?.emit('cuttingTree', {treeId: item._id});
                    setIsTimerRunning(true);
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
