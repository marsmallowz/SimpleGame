/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {FlatList, Pressable, Text, ToastAndroid, View} from 'react-native';
import {ShowList} from '../enums/showList';
import {SocketContext} from '../contexts/SocketContext';
import {useSelector} from 'react-redux';
import {AppState} from '../redux/slices';

export default function MonsterList({
  refresh,
  showListStatus,
  setShowListStatus,
  isTimerRunning,
  setIsTimerRunning,
}: {
  refresh: () => void;
  showListStatus: ShowList;
  setShowListStatus: React.Dispatch<React.SetStateAction<ShowList>>;
  isTimerRunning: boolean;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {socket} = useContext(SocketContext);
  const monsters = useSelector((state: AppState) => state.monsters);

  return (
    <View
      style={{
        flex: showListStatus === ShowList.Monsters ? 1 : 0,
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
          List Monster
        </Text>
        <View style={{flexDirection: 'row', gap: 8}}>
          {showListStatus === ShowList.Monsters ? (
            <Text
              onPress={() => {
                refresh();
                ToastAndroid.show('Monsters refresh', ToastAndroid.SHORT);
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
              if (showListStatus !== ShowList.Monsters) {
                setShowListStatus(ShowList.Monsters);
              } else {
                setShowListStatus(ShowList.None);
              }
            }}
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: 'gray',
            }}>
            {showListStatus === ShowList.Monsters ? 'Hide' : 'Show'}
          </Text>
        </View>
      </View>

      {showListStatus === ShowList.Monsters ? (
        <FlatList
          style={{
            paddingHorizontal: 15,
          }}
          data={monsters.monsters}
          renderItem={({item}) => (
            <View
              style={{
                padding: 5,
                borderRadius: 5,
                marginVertical: 5,
                backgroundColor: item.currentHp <= 0 ? 'lightgray' : 'gray',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{flex: 4}}>
                <Text style={{flex: 4, color: 'white'}}>{item.name}</Text>
                <Text style={{color: 'white'}}>
                  HP: {item.currentHp}/{item.totalHp}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  if (!isTimerRunning) {
                    if (item.currentHp <= 0) {
                      ToastAndroid.show(
                        'Monster has been killed',
                        ToastAndroid.SHORT,
                      );
                    } else {
                      socket?.emit('attackMonster', {monsterId: item._id});
                      setIsTimerRunning(true);
                    }
                  } else {
                    ToastAndroid.show('To many request', ToastAndroid.SHORT);
                  }
                }}
                style={({pressed}) => [
                  {
                    backgroundColor: pressed ? 'lightgray' : 'white',
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
                    verticalAlign: 'middle',
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
