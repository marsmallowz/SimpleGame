/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {Button, Text, View} from 'react-native';
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
import {addMonsters} from '../redux/slices/monstersSlice';
import useRefreshToken from '../utils/refreshToken';
import ModalStatus from '../components/ModalStatus';
import ModalInventory from '../components/ModalInventory';
import NPCList from '../components/npcList';
import ModalNPCQuest from '../components/ModalNpcQuest';

export default function SubAreaScreen() {
  const dispatch = useDispatch();
  const {socket} = useContext(SocketContext);
  const auth = useSelector((state: AppState) => state.auth);
  const user = useSelector((state: AppState) => state.user);
  const {refreshToken} = useRefreshToken();
  const [modalStatusVisible, setModalStatusVisible] = useState(false);
  const [modalInventoryVisible, setModalInventoryVisible] = useState(false);
  const [modalNPCQuestVisible, setModalNPCQuestVisible] = useState(false);
  const [selectedSubAreaId, setSelectedSubAreaId] = useState(null);
  const [selectedNPC, setSelectedNPC] = useState<{
    _id: string;
    name: string;
    description: string;
    talk: string;
  } | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [trees, setTrees] = useState<
    Array<{
      _id: string;
      quantity: number;
      name: string;
    }>
  >([]);
  const [users, setUsers] = useState<
    Array<{
      id: string;
      email: string;
    }>
  >([]);
  const [npcs, setNPCs] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
      talk: string;
    }>
  >([]);
  const [showListStatus, setShowListStatus] = useState<ShowList>(ShowList.None);

  const fetchNPCs = async (subAreaId: string, token: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/npcs?subAreaId=${subAreaId}`,
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
        setNPCs(data);
      } else if (response.status === 401) {
        const result = await refreshToken();
        fetchNPCs(subAreaId, result.accessToken);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMonsters = async (subAreaId: string, token: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/monsters?subAreaId=${subAreaId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        },
      );
      const monsters = await response.json();
      if (response.status === 200) {
        dispatch(addMonsters({monsters: monsters}));
      } else if (response.status === 401) {
        const result = await refreshToken();
        fetchMonsters(subAreaId, result.accessToken);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrees = async (subAreaId: string, token: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/trees?subAreaId=${subAreaId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        },
      );
      const json = await response.json();
      if (response.status === 200) {
        setTrees(json);
      } else if (response.status === 401) {
        const result = await refreshToken();
        fetchTrees(subAreaId, result.accessToken);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async (subAreaId: string, token: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/sub-area-rooms/${subAreaId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        },
      );
      const json = await response.json();
      if (response.status === 200) {
        setUsers(json);
      } else if (response.status === 401) {
        const result = await refreshToken();
        fetchUsers(subAreaId, result.accessToken);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSubArea = async (token: string) => {
    try {
      const response = await fetch(
        `${Config.API_URL}/sub-areas/${user.position?.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-type': 'application/json',
          },
        },
      );
      const subArea = await response.json();
      if (response.status === 200) {
        setSelectedSubAreaId(subArea._id);
        fetchMonsters(subArea._id, token);
        fetchTrees(subArea._id, token);
        fetchUsers(subArea._id, token);
        fetchNPCs(subArea._id, token);
      } else if (response.status === 401) {
        const result = await refreshToken();
        fetchSubArea(result.accessToken);
      } else {
        throw new Error(JSON.stringify(subArea));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refreshMonsters = () => {
    if (selectedSubAreaId && auth.token) {
      fetchMonsters(selectedSubAreaId, auth.token);
    }
  };

  const refreshTrees = () => {
    if (selectedSubAreaId && auth.token) {
      fetchTrees(selectedSubAreaId, auth.token);
    }
  };

  useEffect(() => {
    const handleEvent = (data: {treeId: string; currentQuantity: number}) => {
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
    if (auth.token) {
      fetchSubArea(auth.token);
    }
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
            refresh={refreshMonsters}
            showListStatus={showListStatus}
            setShowListStatus={setShowListStatus}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
          />
          <TreeList
            refresh={refreshTrees}
            trees={trees}
            showListStatus={showListStatus}
            setShowListStatus={setShowListStatus}
            isTimerRunning={isTimerRunning}
            setIsTimerRunning={setIsTimerRunning}
          />
          <NPCList
            npcs={npcs}
            setSelectedNPC={setSelectedNPC}
            setModalNPCQuestVisible={setModalNPCQuestVisible}
            showListStatus={showListStatus}
            setShowListStatus={setShowListStatus}
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
      <ModalNPCQuest
        npc={selectedNPC}
        setModalNPCQuestVisible={setModalNPCQuestVisible}
        modalNPCQuestVisible={modalNPCQuestVisible}
      />
      <ModalStatus
        setModalStatusVisible={setModalStatusVisible}
        modalStatusVisible={modalStatusVisible}
      />
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
          <ModalInventory
            modalInventoryVisible={modalInventoryVisible}
            setModalInventoryVisible={setModalInventoryVisible}
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
