/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef} from 'react';
import {FlatList, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../redux/slices';
import {SocketContext} from '../contexts/SocketContext';
import {LogData, LogTypes, pushLog} from '../redux/slices/logsSlice';
import {updateCurrentHpUser, userLevelUp} from '../redux/slices/userSlice';
import {ShowList} from '../enums/showList';
import {attackMonster} from '../redux/slices/monstersSlice';

export default function Logs({
  showListStatus,
  setShowListStatus,
}: {
  showListStatus: ShowList;
  setShowListStatus: React.Dispatch<React.SetStateAction<ShowList>>;
}) {
  const dispatch = useDispatch();
  const {socket} = useContext(SocketContext);
  const logs = useSelector((state: AppState) => state.logs);
  const user = useSelector((state: AppState) => state.user);

  const flatListRef = useRef<FlatList>(null);
  useEffect(() => {
    if (socket) {
      socket.on(
        'attackMonster',
        (data: {
          username: string;
          monsterName: string;
          monsterId: string;
          damage: number;
        }) => {
          dispatch(
            attackMonster({monsterId: data.monsterId, damage: data.damage}),
          );
          dispatch(
            pushLog({
              message: `${
                user.username === data.username ? 'You' : `${data.username}`
              } attack ${data.monsterName}`,
              type: LogTypes.AttackMonster,
            }),
          );
        },
      );
      socket.on(
        'monsterAttack',
        (data: {username: string; monsterName: string; attack: number}) => {
          if (user.username === data.username) {
            dispatch(
              pushLog({
                message: `You got ${data.attack} damage from ${data.monsterName}.`,
                type: LogTypes.MonsterAttack,
              }),
            );
            dispatch(updateCurrentHpUser(data.attack));
          } else {
            dispatch(
              pushLog({
                message: `${data.username} got ${data.attack} damage from ${data.monsterName}.`,
                type: LogTypes.MonsterAttack,
              }),
            );
          }
        },
      );
      socket.on(
        'cuttingTree',
        (data: {
          username: string;
          treeId: string;
          treeName: string;
          currentQuantity: number;
        }) => {
          dispatch(
            pushLog({
              message: `${
                data.username === user.username ? 'You' : `${data.username}`
              } cutting down ${data.treeName}.`,
              type: LogTypes.Gathering,
            }),
          );
        },
      );
      socket.on(
        'levelUp',
        (data: {username: string; level: number; pointLeft: number}) => {
          if (user.username === data.username) {
            dispatch(
              userLevelUp({level: data.level, pointLeft: data.pointLeft}),
            );
          }
          dispatch(
            pushLog({
              message: `${
                data.username === user.username ? 'You' : `${data.username}`
              } Level Up to ${data.level}.`,
              type: LogTypes.Gathering,
            }),
          );
        },
      );
      socket.on(
        'monsterDefeat',
        (data: {username: string; monsterName: string}) => {
          dispatch(
            pushLog({
              message: `${
                user.username === data.username ? 'You' : `${data.username}`
              } have killed ${data.monsterName}`,
              type: LogTypes.System,
            }),
          );
        },
      );
      socket.on(
        'getDrop',
        (data: {
          username: string;
          monsterName: string;
          drops: {_id: string; name: string}[];
        }) => {
          for (const drop of data.drops) {
            dispatch(
              pushLog({
                message: `${
                  user.username === data.username ? 'You' : `${data.username}`
                } got ${drop.name} drop from ${data.monsterName}`,
                type: LogTypes.System,
              }),
            );
          }
        },
      );
      socket.on(
        'getExp',
        (data: {username: string; monsterName: string; exp: number}) => {
          dispatch(
            pushLog({
              message: `${
                user.username === data.username ? 'You' : `${data.username}`
              } got ${data.exp} exp from ${data.monsterName}`,
              type: LogTypes.System,
            }),
          );
        },
      );
      socket.on('system', (data: {message: string}) => {
        dispatch(
          pushLog({
            message: `${data.message}`,
            type: LogTypes.System,
          }),
        );
      });
    }
    return () => {
      if (socket) {
        socket.off('attackMonster');
        socket.off('monsterAttack');
        socket.off('cuttingTree');
        socket.off('monsterDefeat');
        socket.off('getDrop');
        socket.off('getExp');
        socket.off('system');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [logs]);

  return (
    <View
      style={{
        flex: 1,
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
          Logs
        </Text>
        <Text
          onPress={() => {
            if (showListStatus !== ShowList.None) {
              setShowListStatus(ShowList.None);
            } else {
              setShowListStatus(ShowList.Monsters);
            }
          }}
          style={{
            fontSize: 14,
            fontWeight: '700',
            color: 'gray',
          }}>
          {showListStatus === ShowList.None ? 'Minimize' : 'Maximize'}
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={logs.logs}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}: {item: LogData}) => (
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 15,
              borderRadius: 5,
              marginVertical: 2,
              gap: 5,
            }}>
            <Text>[{item.time}]</Text>
            <Text>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}
