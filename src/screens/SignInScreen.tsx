/* eslint-disable react-native/no-inline-styles */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Alert, Button, Text, TextInput, View} from 'react-native';
import {RootStackParamList} from '../navigations/types/rootStackParamList';
import Config from 'react-native-config';
import {useDispatch} from 'react-redux';
import {assignAuth} from '../redux/slices/authSlice';
import {
  BannerAd,
  BannerAdSize,
  GAMBannerAd,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

export default function SignInScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'SignIn'>) {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
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
          usernameOrEmail,
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
          usernameOrEmail,
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

  const [loaded, setLoaded] = useState(false);

  const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED, {
    requestNonPersonalizedAdsOnly: true,
    keywords: ['fashion', 'clothing'],
  });

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      },
    );

    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        gap: 10,
        padding: 10,
      }}>
      <Text style={{fontSize: 32}}>Sign In</Text>
      <TextInput
        placeholder="Email or Username"
        onChangeText={value => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(usernameOrEmail) || value.length >= 6) {
            setIsValidEmail(true);
          } else {
            setIsValidEmail(false);
          }
          setUsernameOrEmail(value);
        }}
        style={{
          padding: 8,
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: 'white',
        }}
      />
      {isValidEmail === false && (
        <Text style={{color: 'red'}}>Email or Username not in format</Text>
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
      {/* <Button
        onPress={() => {
          if (loaded) {
            rewarded.show();
          }
        }}
        title="Display Rewarded Ads"
      /> */}

      <GAMBannerAd
        unitId={TestIds.BANNER}
        sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
      />
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
}
