import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Config from 'react-native-config';
import MainStackScreen from './stacks/MainStackScreen';
import {AppState} from '../redux/slices';
import {RootStackParamList} from './types/rootStackParamList';
import SignUpScreen from '../screens/SignUpScreen';
import SignInScreen from '../screens/SignInScreen';
import {assignUser} from '../redux/slices/userSlice';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import {removeAuth} from '../redux/slices/authSlice';
import useRefreshToken from '../utils/refreshToken';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);
  const {refreshToken} = useRefreshToken();

  const fetchUser = async (userId: string, token: string) => {
    try {
      const response = await fetch(`${Config.API_URL}/auth/profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        dispatch(
          assignUser({
            email: data.email,
            attack: data.attack,
            defense: data.defense,
            hp: data.hp,
            mp: data.mp,
            currentHp: data.currentHp,
            currentMp: data.currentMp,
            experience: data.experience,
            dex: data.dex,
            str: data.str,
            int: data.int,
            vit: data.vit,
            luck: data.luck,
            pointLeft: data.pointLeft,
            position: {
              id: data.position._id,
              coordinate: data.position?.coordinate!,
            },
            inventoryId: data.inventory,
          }),
        );
      } else {
        const generateNewToken = await refreshToken();
        fetchUser(generateNewToken.userId, generateNewToken.accessToken);
      }
    } catch (error) {
      console.log(error);
      dispatch(removeAuth());
      dispatch(
        assignUser({
          email: null,
          attack: null,
          defense: null,
          hp: null,
          mp: null,
          currentHp: null,
          currentMp: null,
          experience: null,
          int: 0,
          dex: 0,
          str: 0,
          vit: 0,
          luck: 0,
          pointLeft: 0,
          position: {
            id: null,
            coordinate: null,
          },
        }),
      );
    }
  };

  useEffect(() => {
    if (auth.token && auth.userId && auth.refreshToken) {
      fetchUser(auth.userId, auth.token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.userId]);

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={auth.token ? 'Main' : 'SignIn'}>
        {auth.token ? (
          <RootStack.Screen
            name="Main"
            component={MainStackScreen}
            options={{headerShown: false}}
          />
        ) : (
          <>
            <RootStack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{headerShown: false}}
            />
            <RootStack.Screen
              name="ForgetPassword"
              component={ForgetPasswordScreen}
              options={{headerShown: false}}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
