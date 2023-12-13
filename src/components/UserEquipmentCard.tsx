/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Button, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {AppState} from '../redux/slices';
import {Equipment} from '../redux/slices/userSlice';

export default function UserEquipmentCard({
  name,
  equipment,
  equipmentPosition,
  showListEquipment,
  unwearEquipment,
}: {
  name: string;
  equipment: Equipment | null;
  equipmentPosition?: string;
  showListEquipment: any;
  unwearEquipment: any;
}) {
  const auth = useSelector((state: AppState) => state.auth);

  return (
    <View>
      <Text
        style={{
          marginBottom: 5,
          fontSize: 15,
          fontWeight: '500',
        }}>
        {name}
      </Text>
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
          {equipment?.name ?? 'Empty'}
        </Text>
        {equipment ? (
          <Button
            title="unequip"
            onPress={() => {
              if (auth.token) {
                unwearEquipment({
                  token: auth.token,
                  equipmentId: equipment?._id!,
                  equipmentPosition: equipmentPosition,
                });
              }
            }}
          />
        ) : (
          <Button title="Find Equipment" onPress={showListEquipment} />
        )}
      </View>
    </View>
  );
}
