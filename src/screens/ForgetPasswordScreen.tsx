/* eslint-disable react-native/no-inline-styles */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Alert, Button, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../navigations/types/rootStackParamList';
import Config from 'react-native-config';

export default function ForgetPasswordScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'ForgetPassword'>) {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState<Boolean | null>(null);

  const submitHandler = async () => {
    try {
      const response = await fetch(
        `${Config.API_URL}/auth/request-forget-password`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email,
          }),
        },
      );
      const json = await response.json();
      if (response.status === 200) {
        if (json.emailSent) {
          Alert.alert('Status', 'Email for forget password has been sent', [
            {
              text: 'Close',
              style: 'destructive',
            },
          ]);
        } else {
          Alert.alert(
            'Status',
            'Error email for forget password has not been sent',
            [
              {
                text: 'Close',
                style: 'destructive',
              },
            ],
          );
        }
      }
    } catch (error) {
      Alert.alert('Status', `${error}`, [
        {
          text: 'Close',
          style: 'destructive',
        },
      ]);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', gap: 10, padding: 10}}>
      <Text style={{fontSize: 32}}>Forget Password</Text>
      <TextInput
        style={{
          padding: 8,
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: 'white',
        }}
        placeholder="Email"
        onChangeText={value => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(email)) {
            setIsValidEmail(true);
          } else {
            setIsValidEmail(false);
          }
          setEmail(value);
        }}
      />
      {isValidEmail === false && (
        <Text style={{color: 'red'}}>Email not in format</Text>
      )}
      <View
        style={{
          display: 'flex',
          gap: 5,
        }}>
        <Button
          onPress={() => {
            if (isValidEmail) {
              submitHandler();
            }
          }}
          title="Submit"
        />
        <Button
          color={'gray'}
          onPress={() => navigation.navigate('SignIn')}
          title="Cancel"
        />
      </View>
    </View>
  );
}
