/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {ShowList} from '../enums/showList';

export default function NPCList({
  npcs,
  setSelectedNPC,
  setModalNPCQuestVisible,
  showListStatus,
  setShowListStatus,
}: {
  npcs: any;
  setSelectedNPC: React.Dispatch<
    React.SetStateAction<{
      _id: string;
      name: string;
      description: string;
      talk: string;
    } | null>
  >;
  setModalNPCQuestVisible: React.Dispatch<React.SetStateAction<boolean>>;
  showListStatus: ShowList;
  setShowListStatus: React.Dispatch<React.SetStateAction<ShowList>>;
  setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <View
      style={{
        flex: showListStatus === ShowList.NPCs ? 1 : 0,
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
          List NPC
        </Text>
        <Text
          onPress={() => {
            if (showListStatus !== ShowList.NPCs) {
              setShowListStatus(ShowList.NPCs);
            } else {
              setShowListStatus(ShowList.None);
            }
          }}
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: 'gray',
          }}>
          {showListStatus === ShowList.NPCs ? 'Hide' : 'Show'}
        </Text>
      </View>

      {showListStatus === ShowList.NPCs ? (
        npcs.length ? (
          <FlatList
            style={{
              paddingHorizontal: 15,
            }}
            data={npcs}
            renderItem={({item}) => (
              <View
                style={{
                  padding: 5,
                  borderRadius: 5,
                  marginVertical: 5,
                  backgroundColor: 'gray',
                  flexDirection: 'row',
                }}>
                <Text style={{flex: 4, color: 'white'}}>{item.name}</Text>
                <Pressable
                  onPress={() => {
                    setSelectedNPC(item);
                    setModalNPCQuestVisible(true);
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
                    Talk
                  </Text>
                </Pressable>
              </View>
            )}
          />
        ) : (
          <Text style={{paddingLeft: 15}}>Empty</Text>
        )
      ) : null}
    </View>
  );
}
