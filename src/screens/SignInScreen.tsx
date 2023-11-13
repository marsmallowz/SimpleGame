/* eslint-disable react-native/no-inline-styles */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Alert, Button, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../navigations/types/rootStackParamList';
import Config from 'react-native-config';
import {useDispatch} from 'react-redux';
import {assignAuth} from '../redux/slices/authSlice';

export default function SignInScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'SignIn'>) {
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState<Boolean | null>(null);
  const [isValidPassword, setIsValidPassword] = useState<Boolean | null>(null);
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const verifyHandler = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/auth/request-verify`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });
      const json = await response.json();
      if (response.status === 200) {
        Alert.alert('Status', 'Verification email has been sent', [
          {
            text: 'Close',
            style: 'destructive',
          },
        ]);
      } else {
        const parseJson = JSON.stringify(json);
        Alert.alert('Status', parseJson, [
          {
            text: 'Close',
            style: 'destructive',
          },
        ]);
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

  const submitHandler = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/auth/sign-in`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const json = await response.json();
      if (response.status === 200) {
        dispatch(
          assignAuth({
            userId: json.userId,
            token: json.accessToken,
            refreshToken: json.refreshToken,
          }),
        );
      } else if (response.status === 401) {
        if (json.message === 'User not verified') {
          Alert.alert('Status', `${json.message}`, [
            {
              text: 'Verify',
              onPress: async () => {
                console.log('Verify');
                await verifyHandler();
              },
              style: 'default',
            },
            {
              text: 'Close',
              style: 'cancel',
            },
          ]);
        } else {
          Alert.alert('Status', `${json.message}`, [
            {
              text: 'Close',
              style: 'destructive',
            },
          ]);
        }
      } else {
        Alert.alert('Status', `${JSON.stringify(json)}`, [
          {
            text: 'Close',
            style: 'destructive',
          },
        ]);
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
      <Text style={{fontSize: 32}}>Sign In</Text>
      <TextInput
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
        style={{
          padding: 8,
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: 'white',
        }}
      />
      {isValidEmail === false && (
        <Text style={{color: 'red'}}>Email not in format</Text>
      )}
      <TextInput
        secureTextEntry
        placeholder="Password"
        onChangeText={value => {
          if (value.length <= 8) {
            setIsValidPassword(false);
          } else {
            setIsValidPassword(true);
          }
          setPassword(value);
        }}
        style={{
          padding: 8,
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: 'white',
        }}
      />
      {isValidPassword === false && (
        <Text style={{color: 'red'}}>Password min 8 character</Text>
      )}
      <Button
        onPress={() => {
          if (isValidEmail && isValidPassword) {
            submitHandler();
          }
        }}
        title="Submit"
      />
      <Text style={{fontSize: 16}}>
        Don't have an account?{' '}
        <Text
          style={{color: 'black'}}
          onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Text>
      </Text>
      <Text
        onPress={() => navigation.navigate('ForgetPassword')}
        style={{
          textAlign: 'right',
          fontSize: 16,
        }}>
        Forget password
      </Text>
    </View>
  );
}
