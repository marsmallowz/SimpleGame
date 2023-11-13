/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {Alert, Button, FlatList, Modal, Text, View} from 'react-native';
import Config from 'react-native-config';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../redux/slices';
import Timer from '../components/timer';
import MonsterList from '../components/MonsterList';
import TreeList from '../components/TreeList';
import {ShowList} from '../enums/showList';
import Logs from '../components/Logs';
import UserList from '../components/UserList';
import {SocketContext} from '../contexts/SocketContext';
import {fetchMonsters} from '../redux/slices/monstersSlice';
import {updateUserStatus} from '../redux/slices/userSlice';

export default function SubAreaScreen() {
  const dispatch = useDispatch();
  const {socket} = useContext(SocketContext);
  const auth = useSelector((state: AppState) => state.auth);
  const user = useSelector((state: AppState) => state.user);
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [modalInventoryVisible, setModalInventoryVisible] = useState(false);
  const [STR, setSTR] = useState(0);
  const [VIT, setVIT] = useState(0);
  const [INT, setINT] = useState(0);
  const [DEX, setDEX] = useState(0);
  const [LUCK, setLUCK] = useState(0);
  const [pointLeft, setPointLeft] = useState(0);

  // inventory simpan di redux aja nanti
  const [inventory, setInventory] = useState<any>(null);

  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [trees, setTrees] = useState<Array<{
    _id: string;
    quantity: number;
    tree: {_id: string; name: string};
  }> | null>(null);
  const [users, setUsers] = useState<Array<{
    id: string;
    email: string;
  }> | null>(null);
  const [showListStatus, setShowListStatus] = useState<ShowList>(ShowList.None);
  const fetchSubArea = async () => {
    try {
      const response = await fetch(
        `${Config.API_URL}/sub-areas/${user.position?.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-type': 'application/json',
          },
        },
      );
      const json = await response.json();
      if (response.status === 200) {
        setTrees(json.subAreaDetails.trees);
        dispatch(fetchMonsters({monsters: json.subAreaDetails.monsters}));
        delete json.subAreaDetails.trees;
        delete json.subAreaDetails.monsters;
        setUsers(json.users);
      } else {
        console.log('gagal');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch(
        `${Config.API_URL}/inventories/${user.inventoryId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${auth.token}`,
            'Content-type': 'application/json',
          },
        },
      );
      const data = await response.json();
      if (response.status === 200) {
        setInventory(data);
      } else {
        console.log('gagal');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/users/${auth.userId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          int: user.int + INT,
          str: user.str + STR,
          vit: user.vit + VIT,
          dex: user.dex + DEX,
          luck: user.luck + LUCK,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        dispatch(
          updateUserStatus({
            hp: data.hp,
            mp: data.mp,
            currentHp: data.currentHp,
            currentMp: data.currentMp,
            attack: data.attack,
            defense: data.defense,
            dex: data.dex,
            str: data.str,
            int: data.int,
            vit: data.vit,
            luck: data.luck,
            pointLeft: data.pointLeft,
          }),
        );
        setINT(0);
        setVIT(0);
        setSTR(0);
        setDEX(0);
        setLUCK(0);
        setPointLeft(0);
      } else {
        console.log('gagal');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleEvent = (data: any) => {
      if (trees) {
        const newTrees = trees.map(tree => {
          if (tree._id === data.treeId) {
            return {...tree, quantity: data.currentQuantity};
          } else {
            return tree;
          }
        });
        setTrees(newTrees);
      }
    };
    if (socket) {
      socket.on('cuttingTree', handleEvent);
    }
    return () => {
      if (socket) {
        socket.off('cuttingTree', handleEvent);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trees]);

  useEffect(() => {
    fetchSubArea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
        gap: 10,
        padding: 10,
      }}>
      <View style={{flex: 5, gap: 15}}>
        <View
          style={{
            flex: showListStatus === ShowList.None ? 0 : 4,
            gap: 10,
          }}>
          <MonsterList
            showListStatus={showListStatus}
            setShowListStatus={setShowListStatus}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
          />

          <TreeList
            trees={trees}
            showListStatus={showListStatus}
            setShowListStatus={setShowListStatus}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
          />
          <UserList
            users={users}
            showListStatus={showListStatus}
            setShowListStatus={setShowListStatus}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
          />
        </View>
        <View style={{flex: 1}}>
          <Logs
            showListStatus={showListStatus}
            setShowListStatus={setShowListStatus}
          />
        </View>
      </View>
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
              maxHeight: '50%',
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
            {inventory !== null ? (
              <FlatList
                data={inventory?.rawMaterials}
                renderItem={({item}) => {
                  return (
                    <Text>
                      {item.rawMaterial.name} x{item.quantity}
                    </Text>
                  );
                }}
              />
            ) : (
              <Text>Empty</Text>
            )}
            <Button
              color={'gray'}
              onPress={() => setModalInventoryVisible(!modalInventoryVisible)}
              title="Close"
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalStatusVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalStatusVisible(!modalStatusVisible);
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
              gap: 5,
            }}>
            <Text
              style={{
                marginBottom: 10,
                textAlign: 'center',
                fontSize: 20,
                fontWeight: '600',
              }}>
              Status
            </Text>
            <Text style={{fontSize: 16, fontWeight: '700', marginBottom: 5}}>
              Point Left:{user.pointLeft! - pointLeft}
            </Text>
            <View
              style={{
                flexDirection: 'column',
                gap: 5,
                marginBottom: 5,
              }}>
              <View
                style={{
                  padding: 8,
                  borderRadius: 4,
                  backgroundColor: 'lightgray',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>
                  STR:{user.str} {`${STR ? `+${STR}` : ''}`}
                </Text>
                <View style={{flexDirection: 'row', gap: 5}}>
                  {STR ? (
                    <Button
                      title="Down"
                      onPress={() => {
                        setSTR(STR - 1);
                        setPointLeft(pointLeft - 1);
                      }}
                    />
                  ) : null}
                  {user.pointLeft - pointLeft > 0 ? (
                    <Button
                      title="Up"
                      onPress={() => {
                        setSTR(STR + 1);
                        setPointLeft(pointLeft + 1);
                      }}
                    />
                  ) : null}
                </View>
              </View>
              <View
                style={{
                  padding: 8,
                  borderRadius: 4,
                  backgroundColor: 'lightgray',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>
                  INT:{user.int} {`${INT ? `+${INT}` : ''}`}
                </Text>
                <View style={{flexDirection: 'row', gap: 5}}>
                  {INT ? (
                    <Button
                      title="Down"
                      onPress={() => {
                        setINT(INT - 1);
                        setPointLeft(pointLeft - 1);
                      }}
                    />
                  ) : null}
                  {user.pointLeft - pointLeft > 0 ? (
                    <Button
                      title="Up"
                      onPress={() => {
                        setINT(INT + 1);
                        setPointLeft(pointLeft + 1);
                      }}
                    />
                  ) : null}
                </View>
              </View>
              <View
                style={{
                  padding: 8,
                  borderRadius: 4,
                  backgroundColor: 'lightgray',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>
                  DEX:{user.dex} {`${DEX ? `+${DEX}` : ''}`}
                </Text>
                <View style={{flexDirection: 'row', gap: 5}}>
                  {DEX ? (
                    <Button
                      title="Down"
                      onPress={() => {
                        setDEX(DEX - 1);
                        setPointLeft(pointLeft - 1);
                      }}
                    />
                  ) : null}
                  {user.pointLeft - pointLeft > 0 ? (
                    <Button
                      title="Up"
                      onPress={() => {
                        setDEX(DEX + 1);
                        setPointLeft(pointLeft + 1);
                      }}
                    />
                  ) : null}
                </View>
              </View>
              <View
                style={{
                  padding: 8,
                  borderRadius: 4,
                  backgroundColor: 'lightgray',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>
                  VIT:{user.vit} {`${VIT ? `+${VIT}` : ''}`}
                </Text>
                <View style={{flexDirection: 'row', gap: 5}}>
                  {VIT ? (
                    <Button
                      title="Down"
                      onPress={() => {
                        setVIT(VIT - 1);
                        setPointLeft(pointLeft - 1);
                      }}
                    />
                  ) : null}
                  {user.pointLeft - pointLeft > 0 ? (
                    <Button
                      title="Up"
                      onPress={() => {
                        setVIT(VIT + 1);
                        setPointLeft(pointLeft + 1);
                      }}
                    />
                  ) : null}
                </View>
              </View>
              <View
                style={{
                  padding: 8,
                  borderRadius: 4,
                  backgroundColor: 'lightgray',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>
                  LUCK:{user.luck} {`${LUCK ? `+${LUCK}` : ''}`}
                </Text>
                <View style={{flexDirection: 'row', gap: 5}}>
                  {LUCK ? (
                    <Button
                      title="Down"
                      onPress={() => {
                        setLUCK(LUCK - 1);
                        setPointLeft(pointLeft - 1);
                      }}
                    />
                  ) : null}
                  {user.pointLeft - pointLeft > 0 ? (
                    <Button
                      title="Up"
                      onPress={() => {
                        setLUCK(LUCK + 1);
                        setPointLeft(pointLeft + 1);
                      }}
                    />
                  ) : null}
                </View>
              </View>
            </View>
            {user.pointLeft !== 0 ? (
              <Button
                onPress={() => {
                  updateStatus();
                }}
                title="Submit"
              />
            ) : null}
            <Button
              color={'gray'}
              onPress={() => setModalStatusVisible(!modalStatusVisible)}
              title="Close"
            />
          </View>
        </View>
      </Modal>
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          borderRadius: 5,
          padding: 15,
          backgroundColor: 'white',
        }}>
        <View style={{flex: 2}}>
          <Text style={{fontSize: 16, marginBottom: 5, fontWeight: '700'}}>
            User Details
          </Text>
          <Text>
            HP: {user.currentHp}/{user.hp}
          </Text>
          <Text>
            MP: {user.currentMp}/{user.mp}
          </Text>
          <Text>Attack: {user.attack}</Text>
          <Text>Defense: {user.defense}</Text>
          {isTimerRunning ? (
            <Timer
              duration={5}
              onTimerComplete={() => {
                setIsTimerRunning(false);
              }}
            />
          ) : (
            <Text
              style={{
                marginTop: 2,
                fontSize: 14,
                marginBottom: 5,
                fontWeight: '700',
                color: 'gray',
              }}>
              *Can make request
            </Text>
          )}
        </View>
        <View style={{flex: 1, gap: 5}}>
          <Text style={{fontSize: 16, marginBottom: 5, fontWeight: '700'}}>
            Actions
          </Text>
          <Button
            color={'gray'}
            title="Inventory"
            onPress={() => {
              fetchInventory();
              setModalInventoryVisible(true);
            }}
          />
          <Button
            color={'gray'}
            title="Profile"
            onPress={() => setModalStatusVisible(true)}
          />
        </View>
      </View>
    </View>
  );
}
