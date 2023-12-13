/* eslint-disable react-native/no-inline-styles */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {Alert, Button, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../navigations/types/rootStackParamList';
import Config from 'react-native-config';

export default function SignUpScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'SignUp'>) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isValidEmail, setIsValidEmail] = useState<Boolean | null>(null);
  const [isValidUsername, setIsValidUsername] = useState<Boolean | null>(null);
  const [isValidPassword, setIsValidPassword] = useState<Boolean | null>(null);
  const [isValidRePassword, setIsValidRePassword] = useState<Boolean | null>(
    null,
  );
  const [rePassword, setRePassword] = useState('');

  const submitHandler = async () => {
    if (password === rePassword) {
      try {
        const response = await fetch(`${Config.API_URL}/auth/sign-up`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email,
            username,
            password,
            rePassword,
          }),
        });
        const json = await response.json();
        if (response.status === 201) {
          Alert.alert('Status', 'Registration Successfully', [
            {
              text: 'Close',
              style: 'destructive',
              onPress: () => navigation.navigate('SignIn'),
            },
          ]);
        } else {
          Alert.alert(
            'Status',
            `Registration Failed: ${JSON.stringify(json)}`,
            [
              {
                text: 'Close',
                style: 'destructive',
              },
            ],
          );
        }
      } catch (error) {
        Alert.alert('Status', `Registration Failed: ${error}`, [
          {
            text: 'Close',
            style: 'destructive',
          },
        ]);
      }
    }
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', gap: 10, padding: 10}}>
      <Text style={{fontSize: 32}}>Sign Up</Text>
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
      <TextInput
        style={{
          padding: 8,
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: 'white',
        }}
        placeholder="Username"
        onChangeText={value => {
          if (value.length <= 6) {
            setIsValidUsername(false);
          } else {
            setIsValidUsername(true);
          }
          setUsername(value);
        }}
      />
      {isValidUsername === false && (
        <Text style={{color: 'red'}}>Username min 6 character</Text>
      )}
      <TextInput
        secureTextEntry
        style={{
          padding: 8,
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: 'white',
        }}
        placeholder="Password"
        onChangeText={value => {
          if (value.length <= 8) {
            setIsValidPassword(false);
          } else {
            setIsValidPassword(true);
          }
          if (value !== rePassword) {
            setIsValidRePassword(false);
          } else {
            setIsValidRePassword(true);
          }
          setPassword(value);
        }}
      />
      {isValidPassword === false && (
        <Text style={{color: 'red'}}>Password min 8 character</Text>
      )}
      <TextInput
        secureTextEntry
        style={{
          padding: 8,
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: 'white',
        }}
        placeholder="Re-Password"
        onChangeText={value => {
          if (value !== password) {
            setIsValidRePassword(false);
          } else {
            setIsValidRePassword(true);
          }
          setRePassword(value);
        }}
      />
      {isValidRePassword === false && (
        <Text style={{color: 'red'}}>Re-Password not match with password</Text>
      )}
      <Button
        onPress={() => {
          if (
            isValidEmail &&
            isValidPassword &&
            isValidRePassword &&
            isValidUsername
          ) {
            submitHandler();
          }
        }}
        title="Submit"
      />
      <Text style={{fontSize: 16}}>
        Do you have an account?{' '}
        <Text
          style={{color: 'black'}}
          onPress={() => navigation.navigate('SignIn')}>
          Sign In
        </Text>
      </Text>
    </View>
  );
}
