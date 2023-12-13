/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../redux/slices';
import useRefreshToken from '../utils/refreshToken';
import {EquipmentType} from '../enums/equipment-type';
import Config from 'react-native-config';
import {
  Equipment,
  addUserEquipment,
  removeUserEquipment,
  updateBasicStatus,
} from '../redux/slices/userSlice';
import UserEquipmentCard from './UserEquipmentCard';

export default function ModalEquipment({
  equipments,
  setEquipments,
  modalEquipmentVisible,
  setModalEquipmentVisible,
}: {
  equipments: Array<{
    _id: string;
    quantity: number;
    equipment: Equipment;
  }>;
  setEquipments: React.Dispatch<
    React.SetStateAction<
      Array<{
        _id: string;
        quantity: number;
        equipment: Equipment;
      }>
    >
  >;
  modalEquipmentVisible: boolean;
  setModalEquipmentVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);
  const user = useSelector((state: AppState) => state.user);
  const {refreshToken} = useRefreshToken();
  const [showEquipment, setShowEquipment] = useState(false);
  const [listEquipment, setListEquipment] = useState<
    Array<{
      _id: string;
      quantity: number;
      equipment: Equipment;
    }>
  >(equipments);
  const [tabListEquipment, setTabListEquipment] = useState('All');

  // const [equipments, setEquipments] = useState<
  //   Array<{
  //     _id: string;
  //     quantity: number;
  //     equipment: {_id: string; name: string};
  //   }>
  // >([]);

  const usingEquipment = async ({
    equipmentId,
    token,
    equipmentPosition,
  }: {
    equipmentId: string;
    token: string;
    equipmentPosition?: string;
  }) => {
    try {
      const response = await fetch(`${Config.API_URL}/actions/wear-equipment`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          equipmentId,
          equipmentPosition,
        }),
      });
      const json = await response.json();
      if (response.status === 200) {
        if (equipments.length) {
          const newEquipments = [...equipments];
          const existingItemIndex = newEquipments.findIndex(item => {
            return item.equipment._id === equipmentId && item.quantity > 0;
          });
          if (existingItemIndex !== -1) {
            newEquipments[existingItemIndex].quantity -= 1;
            if (newEquipments[existingItemIndex].quantity <= 0) {
              newEquipments.splice(existingItemIndex, 1);
            }
            setEquipments(newEquipments);
            dispatch(
              addUserEquipment({
                equipment: equipments[existingItemIndex].equipment,
                equipmentPosition: equipmentPosition,
              }),
            );
          }
        }
        dispatch(updateBasicStatus(json));
        ToastAndroid.show('Successfully Wear Equipment', ToastAndroid.SHORT);
      } else if (response.status === 401) {
        const result = await refreshToken();
        usingEquipment({
          equipmentId,
          token: result.accessToken,
          equipmentPosition,
        });
      } else {
        throw new Error(JSON.stringify(json));
      }
    } catch (error) {
      Alert.alert('Error Wear Equipment', `${error}`, [
        {
          text: 'Close',
          style: 'destructive',
        },
      ]);
    }
  };

  const unwearEquipment = async ({
    equipmentId,
    token,
    equipmentPosition,
  }: {
    equipmentId: string;
    token: string;
    equipmentPosition?: string;
  }) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/actions/un-wear-equipment`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            equipmentId,
            equipmentPosition,
          }),
        },
      );
      const json = await response.json();
      if (response.status === 200) {
        const newEquipments = [...equipments];
        const existingItemIndex = newEquipments.findIndex(item => {
          return item?.equipment?._id === equipmentId && item?.quantity > 0;
        });
        if (existingItemIndex !== -1) {
          newEquipments[existingItemIndex].quantity += 1;
          setEquipments(newEquipments);
        } else {
          newEquipments.push(json.equipment);
          setEquipments(newEquipments);
        }
        dispatch(
          removeUserEquipment({
            equipment: json.equipment.equipment,
            equipmentPosition: equipmentPosition,
          }),
        );
        dispatch(updateBasicStatus(json.status));
        ToastAndroid.show('Successfully Unwear Equipment', ToastAndroid.SHORT);
      } else if (response.status === 401) {
        const result = await refreshToken();
        unwearEquipment({
          equipmentId,
          token: result.accessToken,
          equipmentPosition,
        });
      } else {
        throw new Error(JSON.stringify(json));
      }
    } catch (error) {
      Alert.alert('Error Unwear Equipment', `${error}`, [
        {
          text: 'Close',
          style: 'destructive',
        },
      ]);
    }
  };

  const showListEquipment = () => {
    setShowEquipment(!setEquipments);
  };

  useEffect(() => {
    setListEquipment(equipments);
    setTabListEquipment('All');
  }, [equipments]);

  return (
    <View>
      <Button
        title="Change Equipment"
        onPress={() => {
          setModalEquipmentVisible(!modalEquipmentVisible);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEquipmentVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalEquipmentVisible(!modalEquipmentVisible);
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
              paddingVertical: 25,
              paddingHorizontal: 15,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <Text
              style={{
                marginBottom: 15,
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '600',
              }}>
              Change Equipment
            </Text>
            <View style={{flex: 1, gap: 7, marginBottom: 10}}>
              <View
                style={{
                  flex: showEquipment ? 1 : 0,
                  gap: 8,
                  paddingVertical: 15,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                  borderBottomWidth: 1,
                  borderColor: 'lightgray',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                    }}>
                    Equipments
                  </Text>
                  <Text
                    onPress={() => {
                      setShowEquipment(!showEquipment);
                    }}
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                    }}>
                    {showEquipment ? 'Hide' : 'Show'}
                  </Text>
                </View>
                {showEquipment ? (
                  <ScrollView>
                    <UserEquipmentCard
                      equipment={user.rightHand}
                      equipmentPosition="Right"
                      name="Right Hand"
                      showListEquipment={showListEquipment}
                      unwearEquipment={unwearEquipment}
                    />
                    <UserEquipmentCard
                      equipment={user.leftHand}
                      equipmentPosition="Left"
                      name="Left Hand"
                      showListEquipment={showListEquipment}
                      unwearEquipment={unwearEquipment}
                    />
                    <UserEquipmentCard
                      equipment={user.head}
                      name="Head"
                      showListEquipment={showListEquipment}
                      unwearEquipment={unwearEquipment}
                    />
                    <UserEquipmentCard
                      equipment={user.body}
                      name="Body"
                      showListEquipment={showListEquipment}
                      unwearEquipment={unwearEquipment}
                    />
                    <UserEquipmentCard
                      equipment={user.rightArm}
                      equipmentPosition="Right"
                      name="Right Arm"
                      showListEquipment={showListEquipment}
                      unwearEquipment={unwearEquipment}
                    />
                    <UserEquipmentCard
                      equipment={user.leftArm}
                      equipmentPosition="Left"
                      name="Left Arm"
                      showListEquipment={showListEquipment}
                      unwearEquipment={unwearEquipment}
                    />
                    <UserEquipmentCard
                      equipment={user.lowerBody}
                      name="Lower Body"
                      showListEquipment={showListEquipment}
                      unwearEquipment={unwearEquipment}
                    />
                    <UserEquipmentCard
                      equipment={user.rightLeg}
                      equipmentPosition="Right"
                      name="Right Leg"
                      showListEquipment={showListEquipment}
                      unwearEquipment={unwearEquipment}
                    />
                    <UserEquipmentCard
                      equipment={user.leftLeg}
                      equipmentPosition="Left"
                      name="Left Leg"
                      showListEquipment={showListEquipment}
                      unwearEquipment={unwearEquipment}
                    />
                  </ScrollView>
                ) : null}
              </View>
              <View
                style={{
                  flex: !showEquipment ? 1 : 0,
                  gap: 8,
                  paddingVertical: 15,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                    }}>
                    List Equipment
                  </Text>
                  <Text
                    onPress={() => {
                      setShowEquipment(!showEquipment);
                    }}
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                    }}>
                    {!showEquipment ? 'Hide' : 'Show'}
                  </Text>
                </View>
                {!showEquipment ? (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Pressable
                        onPress={() => {
                          setTabListEquipment('All');
                          setListEquipment(equipments);
                        }}>
                        <Text
                          style={{
                            fontWeight:
                              tabListEquipment === 'All' ? '600' : '400',
                          }}>
                          All
                        </Text>
                      </Pressable>
                      <Text> | </Text>
                      <Pressable
                        onPress={() => {
                          const newEquipments: any = equipments.filter(
                            equipment =>
                              equipment.equipment.type ===
                                EquipmentType.OneHanded ||
                              equipment.equipment.type ===
                                EquipmentType.DualHanded,
                          );
                          setListEquipment(newEquipments);
                          setTabListEquipment('Weapon');
                        }}>
                        <Text
                          style={{
                            fontWeight:
                              tabListEquipment === 'Weapon' ? '600' : '400',
                          }}>
                          Weapon
                        </Text>
                      </Pressable>
                      <Text> | </Text>
                      <Pressable
                        onPress={() => {
                          const newEquipments: any = equipments.filter(
                            equipment =>
                              equipment.equipment.type !==
                                EquipmentType.OneHanded &&
                              equipment.equipment.type !==
                                EquipmentType.DualHanded,
                          );
                          setListEquipment(newEquipments);
                          setTabListEquipment('Armor');
                        }}>
                        <Text
                          style={{
                            fontWeight:
                              tabListEquipment === 'Armor' ? '600' : '400',
                          }}>
                          Armor
                        </Text>
                      </Pressable>
                    </View>
                    {listEquipment.length ? (
                      <FlatList
                        data={listEquipment}
                        renderItem={({item}) => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                backgroundColor: 'lightgray',
                                marginBottom: 5,
                              }}>
                              <Text
                                style={{
                                  textAlignVertical: 'center',
                                  paddingLeft: 5,
                                }}>
                                {item?.equipment.name} x{item?.quantity}
                              </Text>
                              <Button
                                title="equip"
                                onPress={() => {
                                  if (
                                    item?.equipment.type ===
                                      EquipmentType.Head ||
                                    item?.equipment.type ===
                                      EquipmentType.UpperBody ||
                                    item?.equipment.type ===
                                      EquipmentType.LowerBody
                                  ) {
                                    if (auth.token) {
                                      usingEquipment({
                                        equipmentId: item.equipment._id,
                                        token: auth.token,
                                      });
                                    }
                                  } else {
                                    Alert.alert(
                                      'Choose position',
                                      'Select the position part you want to use the equipment for.',
                                      [
                                        {
                                          text: 'Left',
                                          style: 'default',
                                          onPress: () => {
                                            if (auth.token && item) {
                                              usingEquipment({
                                                equipmentId: item.equipment._id,
                                                token: auth.token,
                                                equipmentPosition: 'Left',
                                              });
                                            }
                                          },
                                        },
                                        {
                                          text: 'Right',
                                          style: 'default',
                                          onPress: () => {
                                            if (auth.token && item) {
                                              usingEquipment({
                                                equipmentId: item.equipment._id,
                                                token: auth.token,
                                                equipmentPosition: 'Right',
                                              });
                                            }
                                          },
                                        },
                                      ],
                                    );
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
                  </>
                ) : null}
              </View>
            </View>
            <View style={{gap: 6}}>
              <Button
                color={'gray'}
                onPress={() => setModalEquipmentVisible(!modalEquipmentVisible)}
                title="Close"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
