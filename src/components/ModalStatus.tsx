/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Alert, Button, Modal, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../redux/slices';
import Config from 'react-native-config';
import {updateUserStatus} from '../redux/slices/userSlice';
import useRefreshToken from '../utils/refreshToken';

export default function ModalStatus({
  modalStatusVisible,
  setModalStatusVisible,
}: {
  modalStatusVisible: boolean;
  setModalStatusVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const {refreshToken} = useRefreshToken();
  const user = useSelector((state: AppState) => state.user);
  const auth = useSelector((state: AppState) => state.auth);

  const [STR, setSTR] = useState(0);
  const [VIT, setVIT] = useState(0);
  const [INT, setINT] = useState(0);
  const [DEX, setDEX] = useState(0);
  const [LUCK, setLUCK] = useState(0);
  const [pointLeft, setPointLeft] = useState(0);

  const updateStatus = async (userId: string, token: string) => {
    try {
      const response = await fetch(`${Config.API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
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
      } else if (response.status === 401) {
        const result = await refreshToken();
        updateStatus(result.userId, result.accessToken);
      } else {
        throw new Error(JSON.stringify(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
                if (auth.userId && auth.token) {
                  updateStatus(auth.userId, auth.token);
                }
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
  );
}
