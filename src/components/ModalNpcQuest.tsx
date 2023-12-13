/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Alert, Button, FlatList, Modal, Text, View} from 'react-native';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../redux/slices';
import useRefreshToken from '../utils/refreshToken';
import {userReportQuest, userTakeQuest} from '../redux/slices/userSlice';

export default function ModalNPCQuest({
  npc,
  modalNPCQuestVisible,
  setModalNPCQuestVisible,
}: {
  npc: {_id: string; name: string; description: string; talk: string} | null;
  modalNPCQuestVisible: boolean;
  setModalNPCQuestVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const {refreshToken} = useRefreshToken();
  const auth = useSelector((state: AppState) => state.auth);
  const user = useSelector((state: AppState) => state.user);

  const [quests, setQuests] = useState<
    Array<{
      _id: string;
      name: string;
      description: string;
    }>
  >([]);

  const fetchNPCQuest = async (token: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/quests?npcId=${npc?._id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        },
      );
      const data = await response.json();
      if (response.status === 200) {
        setQuests(data);
      } else if (response.status === 401) {
        const result = await refreshToken();
        fetchNPCQuest(result.accessToken);
      } else {
        throw new Error(JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const takeQuest = async (questId: string, token: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/actions/user-take-quest`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            questId: questId,
          }),
        },
      );
      const json = await response.json();
      if (response.status === 200) {
        dispatch(userTakeQuest(json));
      } else if (response.status === 401) {
        const result = await refreshToken();
        takeQuest(questId, result.accessToken);
      } else {
        throw new Error(JSON.stringify(json));
      }
    } catch (error) {
      errorAlert(error);
    }
  };

  const reportQuest = async (userQuestId: string, token: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/actions/user-report-quest`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            userQuestId: userQuestId,
            npcId: npc?._id,
          }),
        },
      );
      const json = await response.json();
      if (response.status === 200) {
        const equipmentRewards = json.questId.equipmentObtained.map(
          (reward: any) => {
            return `${reward.equipment.name} x${reward.quantity}`;
          },
        );
        dispatch(userReportQuest(json));
        Alert.alert(
          'Successfully Report Quest',
          `Rewards: ${JSON.stringify(equipmentRewards)}`,
          [
            {
              text: 'Close',
              style: 'destructive',
            },
          ],
        );
      } else if (response.status === 401) {
        const result = await refreshToken();
        reportQuest(userQuestId, result.accessToken);
      } else {
        Alert.alert('Error Report Quest', JSON.stringify(json), [
          {
            text: 'Close',
            style: 'destructive',
          },
        ]);
      }
    } catch (error) {
      Alert.alert('Error Report Quest', `${error}`, [
        {
          text: 'Close',
          style: 'destructive',
        },
      ]);
    }
  };

  useEffect(() => {
    if (auth.token && npc?._id) {
      fetchNPCQuest(auth.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [npc]);

  const errorAlert = (msg: any) =>
    Alert.alert('Error Take Quest', `${msg}`, [
      {
        text: 'Close',
        style: 'cancel',
      },
    ]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalNPCQuestVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalNPCQuestVisible(!modalNPCQuestVisible);
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            minWidth: '70%',
            maxWidth: '80%',
            maxHeight: '60%',
            margin: 20,
            backgroundColor: 'white',
            borderRadius: 5,
            padding: 25,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '600',
              }}>
              NPC
            </Text>
            <Text
              style={{
                marginBottom: 15,
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '600',
              }}>
              {npc?.name}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <View style={{marginBottom: 5}}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                }}>
                Talk
              </Text>
              <Text>{npc?.talk}</Text>
            </View>
            <Text
              style={{
                marginBottom: 5,
                fontSize: 15,
                fontWeight: '500',
              }}>
              Quests
            </Text>
            {quests.length ? (
              <FlatList
                data={quests}
                renderItem={({item}) => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: 'lightgray',
                      }}>
                      <Text
                        style={{
                          textAlignVertical: 'center',
                          paddingLeft: 5,
                        }}>
                        {item.name}
                      </Text>
                      <Button
                        title={
                          user.quests.some(
                            quest =>
                              quest.questId === item._id &&
                              quest.complete === false,
                          )
                            ? 'Report'
                            : 'Take'
                        }
                        onPress={() => {
                          if (auth.token) {
                            const questFound = user.quests.find(
                              quest =>
                                quest.questId === item._id &&
                                quest.complete === false,
                            );
                            if (questFound) {
                              reportQuest(questFound._id, auth.token);
                            } else {
                              takeQuest(item._id, auth.token);
                            }
                          }
                        }}
                      />
                    </View>
                  );
                }}
              />
            ) : (
              <Text>Empty</Text>
            )}
          </View>
          <Button
            color={'gray'}
            onPress={() => setModalNPCQuestVisible(!modalNPCQuestVisible)}
            title="Close"
          />
        </View>
      </View>
    </Modal>
  );
}
