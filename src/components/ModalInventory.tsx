/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Alert, Button, FlatList, Modal, Text, View} from 'react-native';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../redux/slices';
import useRefreshToken from '../utils/refreshToken';
import {Equipment, setCurrentHpUser} from '../redux/slices/userSlice';
import ModalEquipment from './ModalEquipment';

export default function ModalInventory({
  modalInventoryVisible,
  setModalInventoryVisible,
}: {
  modalInventoryVisible: boolean;
  setModalInventoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const {refreshToken} = useRefreshToken();
  const auth = useSelector((state: AppState) => state.auth);
  const user = useSelector((state: AppState) => state.user);
  const [consumables, setConsumables] = useState<
    Array<{
      _id: string;
      quantity: number;
      consumable: {_id: string; name: string};
    }>
  >([]);
  const [rawMaterials, setRawMaterials] = useState<
    Array<{
      _id: string;
      quantity: number;
      rawMaterial: {_id: string; name: string};
    }>
  >([]);
  const [modalEquipmentVisible, setModalEquipmentVisible] = useState(false);
  const [showConsumables, setShowConsumables] = useState(true);

  const [equipments, setEquipments] = useState<
    Array<{
      _id: string;
      quantity: number;
      equipment: Equipment;
    }>
  >([]);
  const fetchInventory = async (token: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/inventories/${user.inventoryId}`,
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
        setConsumables(data.consumables);
        setRawMaterials(data.rawMaterials);
        setEquipments(data.equipments);
      } else if (response.status === 401) {
        const result = await refreshToken();
        fetchInventory(result.accessToken);
      } else {
        throw new Error(JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const usingConsumable = async (consumableId: string, token: string) => {
    try {
      const response = await fetch(`${Config.API_URL}/actions/use-consumable`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          consumableId: consumableId,
        }),
      });
      const json = await response.json();
      if (response.status === 200) {
        if (consumables.length) {
          const newConsumables = [...consumables];
          const existingItemIndex = newConsumables.findIndex(item => {
            return item.consumable._id === consumableId && item.quantity > 0;
          });
          if (existingItemIndex !== -1) {
            newConsumables[existingItemIndex].quantity -= 1;
            if (newConsumables[existingItemIndex].quantity <= 0) {
              newConsumables.splice(existingItemIndex, 1);
            }
            setConsumables(newConsumables);
          }
        }
        dispatch(setCurrentHpUser(json.currentHp));
      } else if (response.status === 401) {
        const result = await refreshToken();
        usingConsumable(consumableId, result.accessToken);
      } else {
        throw new Error(JSON.stringify(json));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Button
        color={'gray'}
        title="Inventory"
        onPress={() => {
          if (auth.token) {
            fetchInventory(auth.token);
          }
          setModalInventoryVisible(true);
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalInventoryVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalInventoryVisible(!modalInventoryVisible);
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
            <Text
              style={{
                marginBottom: 15,
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '600',
              }}>
              Inventory
            </Text>
            <View style={{flex: 1, gap: 7, marginBottom: 10}}>
              <View
                style={{
                  flex: showConsumables ? 1 : 0,
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
                    Consumables
                  </Text>
                  <Text
                    onPress={() => {
                      setShowConsumables(!showConsumables);
                    }}
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                    }}>
                    {showConsumables ? 'Hide' : 'Show'}
                  </Text>
                </View>
                {showConsumables ? (
                  <>
                    {consumables.length ? (
                      <FlatList
                        data={consumables}
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
                                {item.consumable.name} x{item.quantity}
                              </Text>
                              <Button
                                title="use"
                                onPress={() => {
                                  if (auth.token) {
                                    usingConsumable(
                                      item.consumable._id,
                                      auth.token,
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
              <View
                style={{
                  flex: !showConsumables ? 1 : 0,
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
                    Raw Materials
                  </Text>
                  <Text
                    onPress={() => {
                      setShowConsumables(!showConsumables);
                    }}
                    style={{
                      fontSize: 14,
                      fontWeight: '700',
                    }}>
                    {!showConsumables ? 'Hide' : 'Show'}
                  </Text>
                </View>
                {!showConsumables ? (
                  <>
                    {rawMaterials.length ? (
                      <FlatList
                        data={rawMaterials}
                        renderItem={({item}) => {
                          return (
                            <View
                              style={{
                                backgroundColor: 'lightgray',
                                paddingVertical: 8,
                                marginBottom: 5,
                              }}>
                              <Text
                                style={{
                                  textAlignVertical: 'center',
                                  paddingLeft: 5,
                                }}>
                                {item.rawMaterial.name} x{item.quantity}
                              </Text>
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
            {/* <View style={{flex: 1}}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 15,
                    fontWeight: '500',
                  }}>
                  Consumables
                </Text>
                {consumables.length ? (
                  <FlatList
                    data={consumables}
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
                            {item.consumable.name} x{item.quantity}
                          </Text>
                          <Button
                            title="use"
                            onPress={() => {
                              if (auth.token) {
                                usingConsumable(
                                  item.consumable._id,
                                  auth.token,
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
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    marginBottom: 5,
                    fontSize: 15,
                    fontWeight: '500',
                  }}>
                  Raw Materials
                </Text>
                {rawMaterials.length ? (
                  <FlatList
                    data={rawMaterials}
                    renderItem={({item}) => {
                      return (
                        <View
                          style={{
                            backgroundColor: 'lightgray',
                            paddingVertical: 8,
                            marginBottom: 5,
                          }}>
                          <Text
                            style={{
                              textAlignVertical: 'center',
                              paddingLeft: 5,
                            }}>
                            {item.rawMaterial.name} x{item.quantity}
                          </Text>
                        </View>
                      );
                    }}
                  />
                ) : (
                  <Text>Empty</Text>
                )}
              </View>
            </View> */}
            <View style={{gap: 6}}>
              <ModalEquipment
                equipments={equipments}
                setEquipments={setEquipments}
                modalEquipmentVisible={modalEquipmentVisible}
                setModalEquipmentVisible={setModalEquipmentVisible}
              />
              <Button
                color={'gray'}
                onPress={() => setModalInventoryVisible(!modalInventoryVisible)}
                title="Close"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
