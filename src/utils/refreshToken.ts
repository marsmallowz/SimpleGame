import {useDispatch, useSelector} from 'react-redux';
import {updateToken} from '../redux/slices/authSlice';
import Config from 'react-native-config';
import {AppState} from '../redux/slices';

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: AppState) => state.auth);

  const refreshToken = async () => {
    try {
      const response = await fetch(`${Config.API_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: auth.refreshToken,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        dispatch(
          updateToken({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          }),
        );
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {refreshToken};
};

export default useRefreshToken;
