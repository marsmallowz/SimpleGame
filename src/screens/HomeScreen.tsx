/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {removeAuth} from '../redux/slices/authSlice';
import {AppState} from '../redux/slices';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigations/types/mainStackParamList';
import {SocketContext} from '../contexts/SocketContext';
import {updateUserPosition} from '../redux/slices/userSlice';
import Icon from 'react-native-vector-icons/AntDesign';
import {updateSetting} from '../redux/slices/settingSlice';

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<MainStackParamList, 'Home'>) {
  const dispatch = useDispatch();
  const {socket} = useContext(SocketContext);
  const user = useSelector((state: AppState) => state.user);
  const setting = useSelector((state: AppState) => state.setting);

  const [area, setArea] = useState<{
    _id: string;
    column: number;
    name: string;
  } | null>(null);
  const [subAreas, setSubAreas] = useState<
    Array<{
      _id: string;
      areaId: string;
      coordinate: number;
      name: string;
    }>
  >([]);
  const showToastJoinedUser = (data: {username: string}) => {
    ToastAndroid.showWithGravity(
      `${
        data.username === user.username
          ? `Welecome ${data.username}`
          : `${data.username} has joined`
      }`,
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
    );
  };

  const GridItem = ({
    item,
  }: {
    item: {
      _id: string;
      areaId: string;
      coordinate: number;
      name: string;
    };
  }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleGridItemClick(item._id, item.coordinate);
        }}>
        <View
          style={[
            {
              flexDirection: 'column',
              margin: 1,
              padding: 10,
              width: 120,
              height: 120,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${
                user.position?.coordinate === item.coordinate
                  ? 'gray'
                  : 'lightgray'
              }`,
            },
          ]}>
          <Text style={{color: 'black'}}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleGridItemClick = (idPosition: string, coordinate: number) => {
    if (area) {
      const col1 = (user.position?.coordinate! - 1) % area.column;
      const row1 = Math.floor((user.position?.coordinate! - 1) / area.column);
      const col2 = (coordinate - 1) % area.column;
      const row2 = Math.floor((coordinate - 1) / area.column);

      if (Math.abs(col1 - col2) <= 1 && Math.abs(row1 - row2) <= 1) {
        if (idPosition === user?.position?.id) {
          navigation.navigate('SubArea');
        } else {
          dispatch(
            updateUserPosition({id: idPosition, coordinate: coordinate}),
          );
          socket?.emit('joinSubArea', {
            email: user.email,
            joinPosition: idPosition,
            leavePosition: user.position?.id,
          });
        }
      } else {
        ToastAndroid.showWithGravity(
          'move one by one',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
        );
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('joinSubArea', (data: {username: string}) => {
        showToastJoinedUser(data);
      });
      socket.on(
        'getAreaDetails',
        (data: {
          area: {_id: string; column: number; name: string};
          subAreas: Array<{
            _id: string;
            areaId: string;
            coordinate: number;
            name: string;
          }>;
          // users: any;
        }) => {
          setArea(data.area);
          setSubAreas(data.subAreas);
        },
      );
    }

    return () => {
      if (socket) {
        socket.off('getAreaDetails');
        socket.off('joinSubArea');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}>
        <Text style={{fontSize: 18}}>Position</Text>
        <Text style={{fontSize: 20, marginBottom: 10}}>
          {area ? area.name : null}
        </Text>
        {subAreas && area ? (
          <FlatList
            data={subAreas}
            numColumns={area.column}
            style={{marginBottom: 10}}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({item}) => {
              return <GridItem item={item} />;
            }}
          />
        ) : null}
        <Button
          title="Details Position"
          onPress={() => {
            navigation.navigate('SubArea');
          }}
        />
        <Button
          title="Log Out"
          color={'gray'}
          onPress={() => {
            dispatch(removeAuth());
          }}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={setting.areaIntro}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          dispatch(updateSetting({areaIntro: !setting.areaIntro}));
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          }}>
          <View style={{padding: 10, backgroundColor: 'white', height: '10%'}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{fontSize: 16, fontWeight: '600'}}>
                Welcome, Player.
              </Text>
              <Icon
                name="close"
                size={16}
                color="black"
                onPress={() => {
                  dispatch(updateSetting({areaIntro: !setting.areaIntro}));
                }}
              />
            </View>
            <Text>
              You are at {area?.name} area, you can access any sub areas one by
              one.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
